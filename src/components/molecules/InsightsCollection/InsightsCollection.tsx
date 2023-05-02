import classNames from "classnames";
import { format } from "date-fns";

import { useRouter } from "next/router";
import { Button, Insight } from "@atoms/index";
import { amountForDisplay } from "@utils/Currency";
import Constants from "@utils/Constants";
import { useDashboardData } from "@hooks/index";
import { InsightsModel } from "@server/models";
import { DisplaySections } from "@utils/Types";

export interface InsightsCollectionProps {
  className?: string;
}

export default function InsightsCollection(props: InsightsCollectionProps) {
  const router = useRouter();
  let { data } = useDashboardData<InsightsModel>(DisplaySections.Insights);

  const loading = data === null;
  const profitable = data?.lastMonthProfit?.amount > 0;
  const overspent = data?.budgetRemaining?.amount < 0;

  if (!data) data = {} as any;

  return (
    <div className={classNames("insightsCollection", props.className)}>
      <Insight loading={loading} title="Total worth" subtitle="/ Cash balance" color="info">
        <h1>
          {amountForDisplay(data.totalWorth)}
          <span>/ {amountForDisplay(data.availableBalance)}</span>
        </h1>
        <label>{amountForDisplay(data.spentInLastWeek)} spent in last 30 days</label>
      </Insight>
      <Insight loading={loading} title="Previous month's profit" color="warning">
        <h1>{amountForDisplay(data.lastMonthProfit)}</h1>
        <label>
          {data.lastMonth} was {!profitable && "not"} profitable
        </label>
      </Insight>
      <Insight loading={loading} title="Budget remaining" color={overspent ? "error" : "success"}>
        <h1>
          {amountForDisplay(data.budgetRemaining)}
          {!loading && <span>left until {data.budgetResetDate && format(data.budgetResetDate, "LLL do")}</span>}
        </h1>
        {!loading && !overspent && (
          <label>
            Spend up to {amountForDisplay(data.budgetRecommendedPerDay)} per day. {data.budgetRecommendedDaysLeft} days left
          </label>
        )}
        {!loading && overspent && (
          <label>
            You&apos;ve overspent your budget. {data.budgetRecommendedDaysLeft} days left
          </label>
        )}
      </Insight>
      <Insight loading={loading} title="Last import" color="error">
        <p className="hint">{data.lastImportMessage}</p>
        <div className="insightsCollection__alignEnd">
          <Button type="danger" wrapContent onClick={() => router.push(Constants.navbarLinks.imports.path)}>
            Import now
          </Button>
        </div>
      </Insight>
    </div>
  );
}
