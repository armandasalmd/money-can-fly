import { useState } from "react";
import { Button, DashboardTabItem } from "@atoms/index";
import { AddEditTransactionDrawer, InsightsCollection, DashboardTabs } from "@components/molecules";
import {
  DashCategorySpendingCard,
  DashChartCard,
  InvestmentsCard,
  InvestmentProfitCard,
  SpendingAnalyticsCard
} from "@organisms/index";
import { publish } from "@utils/Events";

export default function DashboardBody() {
  const [addOpen, setAddOpen] = useState(false);
  const [tabId, setTabId] = useState("main");
  
  const actionButtons = tabId !== "investments" ? [<Button small key="add" type="primary" onClick={() => setAddOpen(true)}>Add transaction</Button>] : [];

  function postSave() {
    publish("searchFormSubmit", null);
  }

  return (
    <div className="dashboardBody">
      <InsightsCollection className="dashboardBody__insights" />
      <div className="dashboardBody__cards">
        <DashboardTabs tabId={tabId} onTabChange={setTabId} actionButtons={actionButtons}>
          <DashboardTabItem id="main" text="Balance chart">
            <DashChartCard />
          </DashboardTabItem>
          <DashboardTabItem id="category" text="Category chart">
            <DashCategorySpendingCard />
          </DashboardTabItem>
          <DashboardTabItem id="spending" text="Spending chart">
            <SpendingAnalyticsCard />
          </DashboardTabItem>
          <DashboardTabItem id="investments" text="Investments">
            <div className="dashboardBody__columns">
              <div className="dashboardBody__column">
                <InvestmentProfitCard /> 
              </div>
              <div className="dashboardBody__column">
                <InvestmentsCard />
              </div>
            </div>
          </DashboardTabItem>
        </DashboardTabs>
      </div>
      <AddEditTransactionDrawer postSave={postSave} open={addOpen} setOpen={setAddOpen} />
    </div>
  );
}
