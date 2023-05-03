import { useState } from "react";
import { ArrowClockwise } from "phosphor-react";

import InvestmentProfitChartComponent from "./InvestmentProfitChart";
import { Card } from "@atoms/index";
import { useDashboardData } from "@hooks/index";
import { InvestmentProfitChart, InvestmentsModel } from "@server/models/display/Investments";
import { DisplaySections } from "@utils/Types";

export default function InvestmentProfitCard() {
  const { data, mutate } = useDashboardData<InvestmentsModel>(DisplaySections.Investments);
  const [reloading, setReloading] = useState(false);

  function onChange() {
    setReloading(true);

    mutate([DisplaySections.Investments]).then(() => setReloading(false));
  }

  const props: InvestmentProfitChart = data?.profitChart || {
    description: "Loading...",
    labels: [],
    values: [],
  };

  return (
    <Card
      loading={data === null || reloading}
      header={{
        color: "info",
        description: props.description,
        title: "3 month profit & loss",
      }}
      headerActions={[
        {
          icon: ArrowClockwise,
          onClick: onChange,
          text: "Refresh",
          type: "text",
        },
      ]}
      noDivider
    >
      <InvestmentProfitChartComponent {...props} />
    </Card>
  );
}
