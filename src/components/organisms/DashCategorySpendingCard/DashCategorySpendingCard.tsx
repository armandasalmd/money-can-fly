import { useState } from "react";
import { ArrowClockwise } from "phosphor-react";

import CategoryChart from "./CategoryChart";
import { Card, DatePeriodSelect, Info } from "@atoms/index";
import { getOneMonthRange } from "@utils/Date";
import { Category, DateRange, DisplaySections } from "@utils/Types";
import { useDashboardData } from "@hooks/index";
import { CategoryAnalysisModel } from "@server/models";
import { publish } from "@utils/Events";

export default function DashCategorySpendingCard() {
  const { data, mutate } = useDashboardData<CategoryAnalysisModel>(DisplaySections.CategoryAnalysis);
  const [reloading, setReloading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getOneMonthRange()
  );

  function onChange(range: DateRange) {
    setDateRange(range);
    if (!range || !range.from || !range.to) return;
    setReloading(true);
    
    mutate([], {
      categoryAnalysisDateRange: range
    }).then(() => setReloading(false));
  }

  function onCaterogyClick(category: Category) {
    publish("transactionSearchFormSubmit", {
      category,
      dateRange: dateRange
    });
  }

  return (
    <Card
      loading={data === null || reloading}
      className="dashCategories"
      error={data?.errorMessage}
      header={{
        color: "info",
        title: "Spending by Category",
        description: data?.cardDescription ?? "Loading...",
      }}
      headerActions={[{
        icon: ArrowClockwise,
        onClick: () => onChange(dateRange),
        text: "Refresh",
        type: "text"
      }]}
      noDivider
    >
      <div className="dashCategories__chart">
        <CategoryChart apiModel={data} onCaterogyClick={onCaterogyClick} />
      </div>
      <Info>Click on the bar to reveal its transactions</Info>
      <div className="dashCategories__filters">
        <DatePeriodSelect
          monthsAhead={0}
          monthsBehind={12}
          onChange={onChange}
          value={dateRange}
          menuAbove
        />
      </div>
    </Card>
  );
}
