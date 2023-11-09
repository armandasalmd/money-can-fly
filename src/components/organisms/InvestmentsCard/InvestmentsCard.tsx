import { useState, useEffect, useCallback } from "react";
import { useRecoilValue } from "recoil";

import { useDashboardData } from "@hooks/index";
import { Card } from "@atoms/index";
import { CreateInvestmentDrawer, InvestmentList } from "@molecules/index";
import { DisplaySections, InvestmentSummary, Money } from "@utils/Types";
import { balanceChartDateRange } from "@recoil/dashboard/atoms";
import { amountForDisplay } from "@utils/Currency";
import { InvestmentDetailsDrawer } from "@components/templates";
import { subscribe, unsubscribe } from "@utils/Events";
import { InvestmentsModel } from "@server/models";

export default function InvestmentsCard() {
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<InvestmentSummary>(null);
  const { data, mutate } = useDashboardData<InvestmentsModel>(DisplaySections.Investments);
  const balanceDateRange = useRecoilValue(balanceChartDateRange);
  const total: Money = data?.totalValue;

  const mutateOtherSections = useCallback(() => {
    mutate([DisplaySections.Insights, DisplaySections.BalanceAnalysis], {
      balanceAnalysisDateRange: balanceDateRange,
    });
  }, [mutate, balanceDateRange]);

  function onCloseCreate(refresh: boolean) {
    setCreateDrawerOpen(false);

    if (refresh) {
      // mutate([DisplaySections.Insights]);
      mutateOtherSections();
    }
  }

  useEffect(() => {
    subscribe("investmentsMutated", mutateOtherSections);

    return () => {
      unsubscribe("investmentsMutated", mutateOtherSections);
    }
  }, [mutate, mutateOtherSections]);

  useEffect(() => {
    // Update selected investment if it has not need deleted
    if (Array.isArray(data?.investments)) {
      const selectedInvestment = data.investments.find((item) => item.id === selectedSummary?.id);
      setSelectedSummary(selectedInvestment ? selectedInvestment : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Card
      loading={!data}
      header={{
        color: "info",
        title: "Investments",
        description: `Total worth is ${total ? amountForDisplay(total) : "0"}`,
      }}
      noDivider
      noContentPaddingX
      noContentPaddingY
      noHeaderSpacing
      headerActions={[
        {
          text: "Add investment",
          type: "primary",
          onClick: () => setCreateDrawerOpen(true),
        }
      ]}
    >
      <InvestmentList investments={data?.investments || []} onClick={setSelectedSummary} />
      <CreateInvestmentDrawer open={createDrawerOpen} onClose={onCloseCreate} />
      <InvestmentDetailsDrawer selectedInvestment={selectedSummary} open={selectedSummary !== null} onClose={() => setSelectedSummary(null)} />
    </Card>
  );
}
