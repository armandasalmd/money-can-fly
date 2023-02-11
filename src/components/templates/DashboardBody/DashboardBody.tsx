import { InsightsCollection } from "@components/molecules";
import {
  DashCategorySpendingCard,
  DashChartCard,
  DashQuickAddCard,
  InvestmentsCard
} from "@organisms/index";

export default function DashboardBody() {
  return (
    <div className="dashboardBody">
      <InsightsCollection className="dashboardBody__insights" />
      <div className="dashboardBody__cards">
        <div className="dashboardBody__column dashboardBody__column--double">
          <DashChartCard />
        </div>
        <div className="dashboardBody__column">
          <DashCategorySpendingCard />
        </div>
        <div className="dashboardBody__column">
          <DashQuickAddCard />
          <InvestmentsCard />
        </div>
      </div>
    </div>
  );
}
