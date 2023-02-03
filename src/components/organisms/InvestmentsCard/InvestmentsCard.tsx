import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";

import { useDashboardData } from "@hooks/index";
import { Card } from "@atoms/index";
import { CreateInvestmentDrawer, InvestmentList } from "@molecules/index";
import { DisplaySections, Money } from "@utils/Types";
import { selectedInvestment } from "@recoil/dashboard/atoms";
import { amountForDisplay, getDefaultMoney } from "@utils/Currency";
import { InvestmentDetailsDrawer } from "@components/templates";
import { subscribe, unsubscribe } from "@utils/Events";
import { InvestmentsModel } from "@server/models";

export default function InvestmentsCard() {
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [selected, setSelected] = useRecoilState(selectedInvestment);
  const { data, mutate } = useDashboardData<InvestmentsModel>(DisplaySections.Investments);
  
  const total: Money = data?.totalValue || getDefaultMoney();

  function onCloseCreate(refresh: boolean) {
    setCreateDrawerOpen(false);

    if (refresh) {
      mutate([DisplaySections.Insights]);
    }
  }

  useEffect(() => {
    function onInvestmentsMutated() {
      mutate([DisplaySections.Insights]);
    }

    subscribe("investmentsMutated", onInvestmentsMutated);

    return () => {
      unsubscribe("investmentsMutated", onInvestmentsMutated);
    }
  }, [mutate]);

  useEffect(() => {
    // Update selected investment if it has not need deleted
    if (Array.isArray(data?.investments)) {
      const selectedInvestment = data.investments.find((item) => item.id === selected?.id);
      setSelected(selectedInvestment ? selectedInvestment : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Card
      loading={!data}
      header={{
        color: "info",
        title: "Investments",
        description: `Total worth is ${amountForDisplay(total)}`,
      }}
      noDivider
      noContentPaddingX
      noContentPaddingY
      noHeaderSpacing
      headerActions={[
        {
          text: "Add investment",
          type: "easy",
          onClick: () => setCreateDrawerOpen(true),
        }
      ]}
    >
      <InvestmentList investments={data?.investments || []} onClick={setSelected} />
      <CreateInvestmentDrawer open={createDrawerOpen} onClose={onCloseCreate} />
      <InvestmentDetailsDrawer open={selected !== null} onClose={() => setSelected(null)} />
    </Card>
  );
}
