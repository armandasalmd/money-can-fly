import { addMonths, format } from "date-fns";
import { CurrencyRateManager } from "./CurrencyRateManager";
import { InvestmentProfitChart } from "@server/models/display/Investments";
import { round, splitDateIntoEqualIntervals } from "@server/utils/Global";
import { Currency, DateRange, Investment } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";

export class InvestmentChartManager {
  private dateRange: DateRange;
  private dateBreakpoints: Date[];

  constructor(private currency: Currency) {
    const now = new Date();

    this.dateRange = {
      to: now,
      from: addMonths(now, -3),
    };
  }

  public async CalculateProfitChart(investments: Investment[]): Promise<InvestmentProfitChart> {
    this.dateBreakpoints = splitDateIntoEqualIntervals(this.dateRange.from, this.dateRange.to, 10, true);

    const finalEvents = investments
      .flatMap((i) => i.timelineEvents.filter((e) => this.IsDateInRange(e.eventDate) && e.type === "adjustment"))
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

    let sum: number = 0;
    let iteratedBreakpointIndex = 0;
    const values = [];
    
    for (const iEvent of finalEvents) {
      if (iEvent.valueChange.currency !== this.currency) {
        iEvent.valueChange = await CurrencyRateManager.getInstance().convertMoney(iEvent.valueChange, this.currency);
      }

      while (iEvent.eventDate.getTime() > this.dateBreakpoints[iteratedBreakpointIndex]?.getTime() ?? Infinity) {
        iteratedBreakpointIndex++;
        values.push(round(sum));
      }

      sum += iEvent.valueChange.amount;
    }

    values.push(round(sum));
    
    const time30DaysAgo = addMonths(new Date(), -1).getTime();
    const last30DaysChangeSum = finalEvents
      .filter(o => o.eventDate.getTime() >= time30DaysAgo)
      .reduce((a, b) => a + b.valueChange.amount, 0);

    return {
      description: `${last30DaysChangeSum < 0 ? "Down" : "Up"} by ${amountForDisplay({
        amount: last30DaysChangeSum,
        currency: this.currency
      })} in last 30 days`,
      labels: this.dateBreakpoints.map((o) => format(o, "MMM d yyyy")),
      values,
    };
  }

  private IsDateInRange(date: Date): boolean {
    let time = date.getTime();

    return this.dateRange.from.getTime() < time && (!this.dateRange.to || time < this.dateRange.to.getTime());
  }
}
