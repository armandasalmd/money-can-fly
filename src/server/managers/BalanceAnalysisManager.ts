import { CookieUser } from "@server/core";
import {
  BalanceAnalysisModel,
  IPeriodPredictionModel,
  IUserPreferencesModel,
  PeriodPredictionModel,
  TransactionModel,
} from "@server/models";
import { DateRange, Investment, Money } from "@utils/Types";
import { round, splitDateIntoEqualIntervals } from "@server/utils/Global";
import { format, differenceInDays, min, max, isWithinInterval } from "date-fns";
import { CurrencyRateManager } from "./CurrencyRateManager";
import { amountForDisplay } from "@utils/Currency";

interface IPredictionPoint {
  date: Date;
  amountChange: number; // in default currency
  pivotedTotal?: number; // in default currency
}

interface IAggregateResult {
  _id: Date | "sumAfterEndDate";
  changes: Money[];
}

interface IPeriodChangeInDefaultCurrency {
  _id: Date | "sumAfterEndDate";
  totalAmount: number;
}

export class BalanceAnalysisManager {
  private dateBreakpoints: Date[];
  private nowBreakpointIndex: number;
  private daysCovered: number;
  private rateManager: CurrencyRateManager;
  private predictionPoints: IPredictionPoint[];
  private totalWorthToday: Money;
  private readonly now: Date;

  constructor(private prefs: IUserPreferencesModel, private cashBalance: Money, private investmentsValue: Money) {
    this.now = new Date();
    this.rateManager = CurrencyRateManager.getInstance();
    this.totalWorthToday = {
      amount: this.cashBalance.amount + this.investmentsValue.amount,
      currency: this.cashBalance.currency,
    };
  }

  public async GetBalanceAnalysis(
    user: CookieUser,
    dateRange: DateRange,
    investments: Investment[]
  ): Promise<BalanceAnalysisModel> {
    dateRange.from = new Date(dateRange.from);
    dateRange.to = new Date(dateRange.to);

    this.daysCovered = differenceInDays(dateRange.to, dateRange.from);

    // Reverse date range if logically incorrect
    if (this.daysCovered < 0) {
      const temp = dateRange.from;
      dateRange.from = dateRange.to;
      dateRange.to = temp;
      this.daysCovered = -this.daysCovered;
    }

    this.dateBreakpoints = splitDateIntoEqualIntervals(
      dateRange.from,
      dateRange.to,
      this.prefs.balanceChartBreakpoints,
      this.daysCovered > 14
    );

    // Replace closest breakpoint with NOW if possible
    if (isWithinInterval(this.now, { start: dateRange.from, end: dateRange.to })) {
      this.nowBreakpointIndex = this.dateBreakpoints.findIndex((o) => o > this.now);

      if (this.nowBreakpointIndex >= 0) this.dateBreakpoints[this.nowBreakpointIndex] = this.now;
    }

    const labels = this.MakeLabels();

    const invDataset = await this.CalculateInvestmentsDataset(investments);

    const [totalWorthDataset] = await Promise.all([
      this.CalculateTotalWorthDataset(user, dateRange, invDataset),
      this.PopulatePredictionPoints(user, dateRange),
    ]);

    const description = this.CreateDescription();
    const expectedWorthDataset = this.dateBreakpoints.map((o) => this.GetPredictionAmountForDate(o));

    return {
      cardDescription: description,
      chartLabels: labels,
      expectedWorthDataset,
      investmentsDataset: invDataset,
      projectionDataset: this.MakeProjectionDataset(expectedWorthDataset, totalWorthDataset),
      totalWorthDataset,
    };
  }

  private MakeProjectionDataset(expectedWorthDataset: number[], totalWorthDataset: number[]): number[] {
    const firstNaN = totalWorthDataset.findIndex((o) => isNaN(o));

    if (firstNaN <= 0) return Array(this.dateBreakpoints.length).fill(NaN);

    const projectionDataset: number[] = Array(firstNaN - 1).fill(NaN);
    let predDelta = expectedWorthDataset[firstNaN - 1] - totalWorthDataset[firstNaN - 1];
    projectionDataset.push(totalWorthDataset[firstNaN - 1]);

    for (let i = firstNaN; i < this.dateBreakpoints.length; i++) {
      projectionDataset.push(expectedWorthDataset[i] - predDelta * 0.9);
      predDelta = expectedWorthDataset[i] - projectionDataset[i];
    }

    return projectionDataset;
  }

  private async CalculateTotalWorthDataset(user: CookieUser, range: DateRange, investmentDataset: number[]): Promise<number[]> {
    // Scenario 1: range is in the future
    if (this.now <= range.from) return Array(this.dateBreakpoints.length).fill(NaN);
    // Scenario 2: range is in the past, or intersects with now

    const aggregateResults = await TransactionModel.aggregate([
      {
        $match: {
          userUID: user.userUID,
          isActive: true,
          date: { $gte: range.from, $lte: this.now },
          $or: [
            { isInvestment: false },
            { investmentEventType: "adjustment" },
          ]
        },
      },
      {
        $bucket: {
          groupBy: "$date",
          boundaries: this.dateBreakpoints,
          default: "sumAfterEndDate",
          output: {
            changes: { $push: { amount: "$amount", currency: "$currency" } },
          },
        },
      },
      {
        $unwind: "$changes",
      },
      {
        $group: {
          _id: {
            currency: "$changes.currency",
            period: "$_id"
          },
          amount: {
            $sum: "$changes.amount",
          },
        }
      },
      {
        $group: {
          _id: "$_id.period",
          changes: {
            $push: {
              currency: "$_id.currency",
              amount: "$amount"
            }
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);

    const groupedChanges = await this.SimplifyAggregateResults(aggregateResults);
    const sumAfterEndDate = groupedChanges.find((o: IPeriodChangeInDefaultCurrency) => o._id == "sumAfterEndDate")?.totalAmount ?? 0;

    let backwardsSum = this.totalWorthToday.amount - sumAfterEndDate; // In default currency
    let worthDataset: number[] = [backwardsSum];
    let breakpointsToCalculate = this.dateBreakpoints.slice(0, this.nowBreakpointIndex);

    for (let i = breakpointsToCalculate.length - 1; i >= 0; i--) {
      const bucket = groupedChanges.find(o => o._id instanceof Date && o._id.getTime() == breakpointsToCalculate[i].getTime());

      if (bucket) backwardsSum = backwardsSum - bucket.totalAmount;

      worthDataset.push(backwardsSum);
    }

    worthDataset = worthDataset.reverse();

    for (let i = worthDataset.length; i < this.dateBreakpoints.length; i++) {
      // This fills empty points until NOW with last known value, and after NOW with NaN
      worthDataset.push(this.dateBreakpoints[i] > this.now ? NaN : worthDataset[worthDataset.length - 1]);
    }

    return worthDataset;
  }

  private async SimplifyAggregateResults(items: IAggregateResult[]): Promise<IPeriodChangeInDefaultCurrency[]> {
    return await Promise.all(
      items.map(async (o) => {
        const total = await this.rateManager.sumMoney(o.changes, this.prefs.defaultCurrency);

        return { _id: o._id, totalAmount: total.amount };
      })
    );
  }

  private CreateDescription(): string {
    const predictionAmountForNow = this.GetPredictionAmountForDate(this.now);
    const delta: Money = {
      amount: this.totalWorthToday.amount - predictionAmountForNow,
      currency: this.prefs.defaultCurrency,
    };

    const percent = predictionAmountForNow === 0 ? 0 : Math.round((delta.amount / predictionAmountForNow) * 1000) / 10;

    return `Currenctly ${amountForDisplay(delta)} (${percent > 0 ? "+" : ""}${percent}%) ${
      delta.amount > 0 ? "above" : "below"
    } expected`;
  }

  private async PopulatePredictionPoints(user: CookieUser, dateRange: DateRange): Promise<void> {
    const requiredDates = [new Date(dateRange.from), new Date(dateRange.to), this.now, this.prefs.forecastPivotDate];
    const from = min(requiredDates);
    const to = max(requiredDates);

    from.setHours(0, 0, 0, 0);
    from.setDate(1);
    to.setHours(0, 0, 0, 0);
    to.setDate(1);

    const periodPredictions: IPeriodPredictionModel[] = await PeriodPredictionModel.find({
      userUID: user.userUID,
      monthDate: { $gte: from, $lte: to },
    }).sort({ monthDate: 1 });

    this.predictionPoints = periodPredictions.flatMap((o) =>
      o.predictions.map(
        (m) =>
          ({
            date: this.GetWeeksDate(m.week, o.monthDate),
            amountChange: m.moneyIn - m.moneyOut,
          } as IPredictionPoint)
      )
    );

    this.CalculatePivotedTotal();
  }

  private CalculatePivotedTotal() {
    let pivotIndex = this.predictionPoints.findIndex((o) => o.date >= this.prefs.forecastPivotDate) - 1;

    if (pivotIndex > 0) {
      let daysDiff = differenceInDays(this.prefs.forecastPivotDate, this.predictionPoints[pivotIndex].date);
      daysDiff = daysDiff > 7 ? 7 : daysDiff;

      this.predictionPoints[pivotIndex].pivotedTotal =
        this.prefs.forecastPivotValue - this.predictionPoints[pivotIndex].amountChange * (daysDiff / 7);

      for (let i = pivotIndex - 1; i >= 0; i--) {
        this.predictionPoints[i].pivotedTotal =
          this.predictionPoints[i + 1].pivotedTotal - this.predictionPoints[i].amountChange;
      }
    } else if (this.predictionPoints.length > 0) {
      this.predictionPoints[0].pivotedTotal = this.prefs.forecastPivotValue;
      pivotIndex = 0;
    } else {
      return this.predictionPoints.forEach((o) => (o.pivotedTotal = NaN));
    }

    for (let i = pivotIndex + 1; i < this.predictionPoints.length; i++) {
      this.predictionPoints[i].pivotedTotal =
        this.predictionPoints[i - 1].pivotedTotal + this.predictionPoints[i - 1].amountChange;
    }
  }

  private GetPredictionAmountForDate(date: Date): number {
    let edgeIndex = -1;

    for (let i = this.predictionPoints.length - 1; i >= 0; i--) {
      if (this.predictionPoints[i].date < date) {
        edgeIndex = i;
        break;
      }
    }

    if (edgeIndex === -1) {
      return this.predictionPoints.length > 0 ? this.predictionPoints[0].pivotedTotal : 0;
    }

    let predictionPoint = this.predictionPoints[edgeIndex];
    let daysDiff = differenceInDays(date, predictionPoint.date);
    daysDiff = daysDiff > 7 ? 7 : daysDiff;

    return round(predictionPoint.pivotedTotal + predictionPoint.amountChange * (daysDiff / 7));
  }

  private GetWeeksDate(week: number, monthDate: Date): Date {
    const date = new Date(monthDate);
    date.setDate(1);
    date.setDate(date.getDate() + (week - 1) * 7);
    return date;
  }

  private MakeLabels(): string[] {
    const template = this.daysCovered <= 14 ? "MMM d HH:mm" : "MMM d";
    return this.dateBreakpoints.map((date) => date === this.now ? "✅ NOW" : format(date, template));
  }

  private async ToDefaultMoney(money: Money, date?: Date): Promise<Money> {
    return await this.rateManager.convertMoney(money, this.prefs.defaultCurrency, date);
  }

  private async CalculateInvestmentsDataset(source: Investment[]): Promise<number[]> {
    const eventsSorted = source
      .flatMap((o) => o.timelineEvents)
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

    let sumInDefaultCurrency = 0;
    const dataset: number[] = [];

    for (const breakpoint of this.dateBreakpoints) {
      if (breakpoint > this.now) {
        dataset.push(NaN);
        continue;
      }

      while (eventsSorted.length > 0 && eventsSorted[0].eventDate.getTime() <= breakpoint.getTime()) {
        const event = eventsSorted.shift();

        sumInDefaultCurrency += (await this.ToDefaultMoney(event.valueChange)).amount;
      }

      dataset.push(sumInDefaultCurrency === 0 ? NaN : sumInDefaultCurrency);
    }

    return dataset;
  }
}
