import classNames from "classnames";

import { useRouter } from "next/router";
import { Button, Insight } from "@atoms/index";
import { amountForDisplay } from "@utils/Currency";
import Constants from "@utils/Constants";

export interface InsightsCollectionProps {
  className?: string;
}

export default function InsightsCollection(props: InsightsCollectionProps) {
  const router = useRouter();
  const balance = { amount: 2310.96, currency: "GBP" } as any;
  const monthlyChange = { amount: 1203.24, currency: "GBP" } as any;
  const budgeLeft = { amount: 201.57, currency: "GBP" } as any;

  return (
    <div className={classNames("insightsCollection", props.className)}>
      <Insight title="Available balance" color="warning">
        <h1>{amountForDisplay(balance)}</h1>
        <label>$98.56 spent in last 7 days</label>
      </Insight>
      <Insight title="Last month profit" color="success">
        <h1>{amountForDisplay(monthlyChange)}</h1>
        <label>2022 January was profitable</label>
      </Insight>
      <Insight title="Budget remaining" color="info">
        <h1>
          {amountForDisplay(budgeLeft)}
          <span>left until 14 Oct</span>
        </h1>
        <label>Spend up to £15.57 per day. 13 days left</label>
      </Insight>
      <Insight title="Last import" color="error">
        <p className="hint">115 Revolut transactions 5 days ago</p>
        <div className="insightsCollection__alignEnd">
          <Button
            type="danger"
            wrapContent
            onClick={() => router.push(Constants.navbarLinks.imports.path)}
          >
            Import now
          </Button>
        </div>
      </Insight>
    </div>
  );
}
