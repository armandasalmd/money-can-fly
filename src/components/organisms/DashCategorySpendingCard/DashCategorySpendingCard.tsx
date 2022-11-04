import { useState } from "react";
import { DateRange } from "react-day-picker/dist/index";

import CategoryChart from "./CategoryChart";
import { Card, DatePeriodSelect, getPeriodNow } from "@atoms/index";

export default function DashCategorySpendingCard() {
  const descriptionDate = "2022 October"; // TODO: replace
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getPeriodNow()
  );

  return (
    <Card
      className="dashCategories"
      header={{
        color: "info",
        title: "Actual spending by Category",
        description: `Statistics for ${descriptionDate}`,
      }}
      noDivider
    >
      <div className="dashCategories__chart">
        <CategoryChart />
      </div>
      <div className="dashCategories__filters">
        <DatePeriodSelect
          monthsAhead={12}
          monthsBehind={12}
          onChange={setDateRange}
          value={dateRange}
          menuAbove
        />
      </div>
    </Card>
  );
}
