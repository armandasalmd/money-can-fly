import { InsightsCollection } from "@components/molecules";
import {
  DashBorrowingsCard,
  DashCategorySpendingCard,
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
          <DashQuickAddCard />
        </div>
        <div className="dashboardBody__column">
          <DashCategorySpendingCard />
          <DashBorrowingsCard />
        </div>
      </div>
    </div>
  );
}
