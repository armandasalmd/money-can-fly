import { InsightsCollection } from "@components/molecules";
import {
  DashChartCard,
  DashQuickAddCard,
} from "@organisms/index";

export default function DashboardBody() {
  return (
    <div className="dashboardBody">
      <InsightsCollection className="dashboardBody__insights" />
      <div className="dashboardBody__cards">
        <div className="dashboardBody__column">
          <DashChartCard />
        </div>
        <div className="dashboardBody__column">
          <DashQuickAddCard />
          {/* <DashCategorySpendingCard /> */}
          {/* <DashBorrowingsCard /> */}
        </div>
      </div>
    </div>
  );
}
