import { addWeeks, min, max, differenceInDays, differenceInCalendarDays } from "date-fns";
import { CookieUser } from "@server/core";
import {
  BalanceAnalysisModel,
  BalanceChartPoint,
  IPeriodPredictionModel,
  IUserPreferencesModel,
  PeriodPredictionModel,
  TransactionModel,
} from "@server/models";
import { getLast, round, findIndexBackwards } from "@server/utils/Global";
import { Currency, DateRange, Investment, Money } from "@utils/Types";
import { getUTCFirstOfMonth, toUTCDate } from "@utils/Date";
import { amountForDisplay } from "@utils/Currency";
import { CurrencyRateManager } from "./CurrencyRateManager";

interface IPredictionPoint {
  date: Date;
  changeAmount: number; // in default currency
  forecastTotal: number; // in default currency
}

interface ITransactionAggregate {
  a: number;
  c: Currency;
  d: Date;
}

// Smaller number means less data points. This number affects chart quality & sharpness
const DATE_RANGE_CHUNK_COUNT = 600;
const DATE_CLUSTER_BY_HOUR = "%Y-%m-%d %H";
const DATE_CLUSTER_BY_MINUTE = "%Y-%m-%d %H-%M";

export class BalanceAnalysisManager {
  private dateRange: DateRange;
  private investments: Investment[];
  private readonly now: Date;
  private predictionPoints: IPredictionPoint[];
  private rateManager: CurrencyRateManager;
  private totalWorthToday: Money;

  constructor(
    private user: CookieUser,
    private prefs: IUserPreferencesModel) {
    this.now = toUTCDate(new Date());
    this.rateManager = CurrencyRateManager.getInstance();
  }

  public async GetBalanceAnalysis(
    dateRange: DateRange,
    totalCashValue: Money,
    totalInvestmentsValue: Money,
    investments: Investment[]
  ): Promise<BalanceAnalysisModel> {
    this.dateRange = dateRange;
    this.investments = investments;
    this.totalWorthToday = {
      amount: totalCashValue.amount + totalInvestmentsValue.amount,
      currency: totalCashValue.currency,
    };

    this.DateRangeValidation();

    let queueResults = await Promise.all([
      this.CalculateBalanceDataset(),
      this.CalculateInvestmentDataset(),
      this.CalculateRequiredPredictions()
    ]);

    return {
      balanceDataset: queueResults[0],
      cardDescription: this.CreateDescription(),
      expectationDataset: this.GetExpectationDataset(),
      investmentDataset: queueResults[1]
    };
  }

  private async CalculateBalanceDataset(): Promise<BalanceChartPoint[]> {
    // Scenario 1: range is in the future
    if (this.now <= this.dateRange.from) return [];
    // Scenario 2: range is in the past, or intersects with now
    let clusteringDateFormat = Math.abs(differenceInCalendarDays(this.dateRange.from, this.dateRange.to)) < 90 ? DATE_CLUSTER_BY_MINUTE : DATE_CLUSTER_BY_HOUR;
    
    let items: ITransactionAggregate[] = await TransactionModel.aggregate([
      {
        $match: {
          userUID: this.user.userUID,
          isActive: true,
          date: { $gte: this.dateRange.from, $lte: this.now },
          $or: [
            { isInvestment: false },
            { investmentEventType: "adjustment" },
          ]
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: clusteringDateFormat,
                date: "$date"
              }
            },
            currency: "$currency"
          },
          sum: { $sum: "$amount" },
          date: { $max: "$date" }
        }
      },
      {
        $sort: {
          date: 1
        }
      },
      {
        $project: {
          a: "$sum",
          c: "$_id.currency",
          d: "$date"
        }
      }
    ]);

    items = await this.NormalizeTransactions(items);

    let lastBalanceValue = this.totalWorthToday.amount;
    let lastItemInRangeIdx = items.length - 1;

    let fromAndNowGapExists = this.now.getTime() > this.dateRange.to.getTime();
    if (fromAndNowGapExists) {
      lastItemInRangeIdx = findIndexBackwards(items, (item: ITransactionAggregate) => item.d.getTime() <= this.dateRange.to.getTime());
      if (lastItemInRangeIdx === -1) return [];
  
      let gapItemsSum = items.slice(lastItemInRangeIdx + 1).reduce((acc, item: ITransactionAggregate) => acc + item.a, 0);
      lastBalanceValue -= gapItemsSum;
    }

    let itemsInRange = items.slice(0, lastItemInRangeIdx + 1);

    let results: BalanceChartPoint[] = [{ x: min([this.dateRange.to, this.now]).getTime(), y: lastBalanceValue }];

    for (let idx = itemsInRange.length - 1; idx >= 0; idx--) {
      lastBalanceValue -= itemsInRange[idx].a;

      results.push({ x: itemsInRange[idx].d.getTime(), y: round(lastBalanceValue) });
    }

    if (itemsInRange[0].d.getTime() !== this.dateRange.from.getTime()) {
      results.push({ x: this.dateRange.from.getTime(), y: round(lastBalanceValue) });
    }

    return results.reverse();
  }

  private async CalculateInvestmentDataset(): Promise<BalanceChartPoint[]> {
    const eventsSorted = this.investments
      .flatMap((o) => o.timelineEvents)
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

    let sumInDefaultCurrency = 0;
    let fromTime = this.dateRange.from.getTime();
    let toTime = this.dateRange.to.getTime();
    const dataset: BalanceChartPoint[] = [];

    for (let idx = 0; idx < eventsSorted.length; idx++) {
      const time = eventsSorted[idx].eventDate.getTime();
      
      sumInDefaultCurrency += (await this.ToDefaultMoney(eventsSorted[idx].valueChange)).amount;

      if (time > toTime) break;
      if (time >= fromTime) {
        if (!dataset.length && idx !== 0) {
          let subtract =  (await this.ToDefaultMoney(eventsSorted[idx - 1].valueChange)).amount;
          dataset.push({ x: fromTime, y: round(sumInDefaultCurrency - subtract) });
        }

        dataset.push({ x: time, y: round(sumInDefaultCurrency) });
      }
    }

    let lastPoint = getLast(dataset);

    if (lastPoint && lastPoint.x !== toTime) dataset.push({ x: toTime, y: lastPoint.y });

    return dataset;
  }

  private CreateDescription(): string {
    const predictionAmountForNow = this.GetPredictionAmountForDate(this.now);
    const delta: Money = {
      amount: this.totalWorthToday.amount - predictionAmountForNow,
      currency: this.prefs.defaultCurrency,
    };

    const percent = predictionAmountForNow === 0 ? 0 : Math.round((delta.amount / predictionAmountForNow) * 1000) / 10;

    return `Currently ${amountForDisplay(delta)} (${percent > 0 ? "+" : ""}${percent}%) ${
      delta.amount > 0 ? "above" : "below"
    } expected`;
  }

  private DateRangeValidation() {
    if (this.dateRange.from.getTime() > this.dateRange.to.getTime()) {
      let temp = this.dateRange.from;
      this.dateRange.from = this.dateRange.to;
      this.dateRange.to = temp;
    }
  }

  private async CalculateRequiredPredictions() {
    let requiredDates = [this.dateRange.from, this.dateRange.to, this.now, this.prefs.forecastPivotDate];

    let from = getUTCFirstOfMonth(min(requiredDates));
    let to = getUTCFirstOfMonth(max(requiredDates));

    let periodPredictions: IPeriodPredictionModel[] = await PeriodPredictionModel.find({
      userUID: this.user.userUID,
      monthDate: { $gte: from, $lte: to },
    }).sort({ monthDate: 1 });

    if (!periodPredictions) return;

    this.predictionPoints = [];

    for (let periodPrediction of periodPredictions) {
      for (let weekPrediction of periodPrediction.predictions) {
        let changeAmount = weekPrediction.moneyIn - weekPrediction.moneyOut;
      
        if (periodPrediction.currency !== this.prefs.defaultCurrency) {
          changeAmount = await this.rateManager.convert(changeAmount, periodPrediction.currency, this.prefs.defaultCurrency);
        }

        this.predictionPoints.push({
          changeAmount,
          date: __GetWeeksDate(weekPrediction.week, periodPrediction.monthDate),
          forecastTotal: 0
        } as IPredictionPoint);
      }
    }

    this.PopulateForecastTotals();

    function __GetWeeksDate(week: number, monthDate: Date): Date {
      return week > 1 ? addWeeks(monthDate, week - 1) : monthDate;
    }
  }

  private GetExpectationDataset(): BalanceChartPoint[] {
    if (!this.predictionPoints.length) return [];

    let firstWithinRangeId = this.predictionPoints.findIndex(o => o.date.getTime() >= this.dateRange.from.getTime());
    let lastWithinRangeId = findIndexBackwards(this.predictionPoints, o => o.date.getTime() <= this.dateRange.to.getTime());

    let results = this.predictionPoints.slice(firstWithinRangeId, lastWithinRangeId + 1);

    if (firstWithinRangeId === -1) {
      let lastForecastValue = getLast(this.predictionPoints).forecastTotal;
      return [
        { x: this.dateRange.from.getTime(), y: lastForecastValue },
        { x: this.dateRange.to.getTime(), y: lastForecastValue }
      ];
    } else if (this.predictionPoints[firstWithinRangeId].date.getTime() !== this.dateRange.from.getTime()) {
      let leftEdgeForecast = this.GetPredictionAmountForDate(this.dateRange.from);

      results.unshift({ date: this.dateRange.from, forecastTotal: leftEdgeForecast, changeAmount: 0 });
    }

    if (lastWithinRangeId === -1) {
      let firstForecastValue = this.predictionPoints[0].forecastTotal;
      return [
        { x: this.dateRange.from.getTime(), y: firstForecastValue },
        { x: this.dateRange.to.getTime(), y: firstForecastValue }
      ];
    } else if (this.predictionPoints[lastWithinRangeId].date.getTime() !== this.dateRange.to.getTime()) {
      let rightEdgeForecast = this.GetPredictionAmountForDate(this.dateRange.to);

      results.push({ date: this.dateRange.to, forecastTotal: rightEdgeForecast, changeAmount: 0 });
    }

    return results.map<BalanceChartPoint>(o => ({ x: o.date.getTime(), y: o.forecastTotal }));
  }

  private GetProportionalChangeValue(point: IPredictionPoint, date: Date) {
    let daysDiff = differenceInDays(date, point.date);
    daysDiff = daysDiff > 7 ? 7 : daysDiff;

    return point.changeAmount * (daysDiff / 7);
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
      return this.predictionPoints.length > 0 ? this.predictionPoints[0].forecastTotal : 0;
    }

    let predictionPoint = this.predictionPoints[edgeIndex];

    return round(predictionPoint.forecastTotal + this.GetProportionalChangeValue(predictionPoint, date));
  }

  private async NormalizeTransactions(sortedItems: ITransactionAggregate[]): Promise<ITransactionAggregate[]> {
    let groupBucketTimeInMs = (this.dateRange.to.getTime() - this.dateRange.from.getTime()) / DATE_RANGE_CHUNK_COUNT;
    
    // Group same dates and convert all to default currency;
    let normalizedList = await Promise.all(
      __GroupItemsByDate().map(async (itemsGroup: ITransactionAggregate[]): Promise<ITransactionAggregate> => {
        let sum = 0;

        for (let item of itemsGroup) {
          sum += await this.rateManager.convert(item.a, item.c, this.prefs.defaultCurrency, this.now);
        }

        return { a: sum, c: this.prefs.defaultCurrency, d: itemsGroup[0].d };
      })
    );

    return normalizedList;

    function __GroupItemsByDate() {
      let newItems: ITransactionAggregate[][] = [];
      let groupingArray: ITransactionAggregate[] = null;
      let lastTime = 0;

      for (let idx = 0; idx < sortedItems.length; idx++) {
        if (sortedItems[idx].d.getTime() - lastTime < groupBucketTimeInMs) {
          groupingArray.push(sortedItems[idx]);
        } else {
          groupingArray !== null && newItems.push(groupingArray);
          groupingArray = [sortedItems[idx]];
          lastTime = sortedItems[idx].d.getTime();
        }
      }
      groupingArray !== null && newItems.push(groupingArray);

      return newItems;
    }
  }

  private PopulateForecastTotals() {
    if (!this.predictionPoints || this.predictionPoints.length === 0) return;

    let forecastPivotIndex = this.predictionPoints.findIndex((o) => o.date >= this.prefs.forecastPivotDate);
    let firstItemForecast = 0;
    
    if (forecastPivotIndex > 0) { // Case: there is week point before forecast point
      let daysDiff = Math.abs(differenceInDays(this.prefs.forecastPivotDate, this.predictionPoints[forecastPivotIndex - 1].date));
      daysDiff = daysDiff > 7 ? 7 : daysDiff;

      let changeToOneBefore = this.predictionPoints[forecastPivotIndex - 1].changeAmount * (daysDiff / 7);
      let oneItemBeforePivotForecast = this.prefs.forecastPivotValue - changeToOneBefore;

      firstItemForecast = this.predictionPoints
        .slice(0, forecastPivotIndex - 1)
        .reduce((acc, item) => acc - item.changeAmount, oneItemBeforePivotForecast);

    } else { // Case: there is no week point before forecast point, only after
      let daysDiff = Math.abs(differenceInDays(this.prefs.forecastPivotDate, this.predictionPoints[0].date));
      daysDiff = daysDiff > 7 ? 7 : daysDiff;

      let changeToOneAfter = this.predictionPoints[0].changeAmount * (daysDiff / 7);
      firstItemForecast = this.prefs.forecastPivotValue - changeToOneAfter;
    }

    this.predictionPoints[0].forecastTotal = firstItemForecast;

    for (let index = 1; index < this.predictionPoints.length; index++) {
      let itemBefore = this.predictionPoints[index - 1];

      this.predictionPoints[index].forecastTotal = itemBefore.forecastTotal + itemBefore.changeAmount;
    }

    let forecastTime = this.prefs.forecastPivotDate.getTime();

    if (forecastTime >= this.dateRange.from.getTime() && forecastTime <= this.dateRange.to.getTime()) {
      let forecastPredictionPoint: IPredictionPoint = {
        changeAmount: 0,
        date: this.prefs.forecastPivotDate,
        forecastTotal: this.prefs.forecastPivotValue
      };
      // Insert forecast pivot point in between
      this.predictionPoints = [
        ...this.predictionPoints.slice(0, forecastPivotIndex),
        forecastPredictionPoint,
        ...this.predictionPoints.slice(forecastPivotIndex),
      ];
    }
    // Round
    for (let point of this.predictionPoints) {
      point.forecastTotal = round(point.forecastTotal);
    }
  }

  private async ToDefaultMoney(money: Money, date?: Date): Promise<Money> {
    return await this.rateManager.convertMoney(money, this.prefs.defaultCurrency, date);
  }
}