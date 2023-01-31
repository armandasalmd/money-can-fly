import { useState } from "react";

import CategoryChart from "./CategoryChart";
import { Card, DatePeriodSelect } from "@atoms/index";
import { getPeriodNow } from "@utils/Global";
import { DateRange, DisplaySections } from "@utils/Types";
import { useDashboardData } from "@hooks/index";
import { CategoryAnalysisModel } from "@server/models";

export default function DashCategorySpendingCard() {
  const { data, mutate } = useDashboardData<CategoryAnalysisModel>(DisplaySections.CategoryAnalysis);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getPeriodNow()
  );

  function onChange(range: DateRange) {
    setDateRange(range);
    
    mutate([], {
      categoryAnalysisDateRange: range
    });
  }

  return (
    <Card
      loading={data === null}
      className="dashCategories"
      error={data?.errorMessage}
      header={{
        color: "info",
        title: "Spending by Category",
        description: data?.cardDescription ?? "Loading...",
      }}
      noDivider
    >
      <div className="dashCategories__chart">
        <CategoryChart apiModel={data} />
      </div>
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
