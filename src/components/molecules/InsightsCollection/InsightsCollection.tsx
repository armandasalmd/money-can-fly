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
  const { data } = useDashboardData<InsightsModel>(DisplaySections.Insights);
  
  const profitable = data?.lastMonthProfit?.amount > 0;
  const loaded = Object.keys(data).length > 0;

  return (
    <div className={classNames("insightsCollection", props.className)}>
      <Insight title="Total worth" subtitle="/ Cash balance" color="info">
        <h1>{amountForDisplay(data.totalWorth)}<span>/ {amountForDisplay(data.availableBalance)}</span></h1>
        <label>{amountForDisplay(data.spentInLastWeek)} spent in last 7 days</label>
      </Insight>
      <Insight title="Last month profit" color="warning">
        <h1>{amountForDisplay(data.lastMonthProfit)}</h1>
        <label>{data.lastMonth} was {!profitable && "not"} profitable</label>
      </Insight>
      <Insight title="Budget remaining" color="success">
        <h1>
          {amountForDisplay(data.budgetRemaining)}
          {loaded && <span>left until {format(data.budgetResetDate, "LLL do")}</span>}
        </h1>
        {loaded && <label>Spend up to {amountForDisplay(data.budgetRecommendedPerDay)} per day. {data.budgetRecommendedDaysLeft} days left</label>}
      </Insight>
      <Insight title="Last import" color="error">
        <p className="hint">{data.lastImportMessage}</p>
        <div className="insightsCollection__alignEnd">
          <Button
            type="danger"
            wrapContent
            onClick={() => router.push(Constants.navbarLinks.imports.path)}>
            Import now
          </Button>
        </div>
      </Insight>
    </div>
  );
}
