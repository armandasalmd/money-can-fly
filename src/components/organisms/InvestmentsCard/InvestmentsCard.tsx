import { useState, useEffect } from "react";
import useSWR from "swr"
import { useRecoilState } from "recoil";

import { Card } from "@atoms/index";
import { CreateInvestmentDrawer, InvestmentList } from "@molecules/index";
import { Investment, InvestmentEvent, Money } from "@utils/Types";
import { selectedInvestment } from "@recoil/dashboard/atoms";
import { amountForDisplay } from "@utils/Currency";
import { InvestmentDetailsDrawer } from "@components/templates";
import { publish, subscribe, unsubscribe } from "@utils/Events";

const fetcher = (url: string, setTotal: any) =>
  fetch(url).then(async (res) => {
    const data = await res.json();
    if (Array.isArray(data?.investments)) {
      data.investments.forEach((item) => {
        item.dateCreated = new Date(item.dateCreated);
        item.dateModified = new Date(item.dateModified);
        item.timelineEvents.forEach((event: InvestmentEvent) => {
          event.eventDate = new Date(event.eventDate);
        })
      });
    }

    setTotal(data.totalValue);

    return data.investments;
  });

export default function InvestmentsCard() {
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [total, setTotal] = useState<Money>({
    amount: 0,
    currency: "GBP",
  });
  const [selected, setSelected] = useRecoilState(selectedInvestment);
  const { data, mutate } = useSWR<Investment[]>("/api/investments/read", (url) => fetcher(url, setTotal))

  function onCloseCreate(refresh: boolean) {
    setCreateDrawerOpen(false);

    if (refresh) {
      mutate();
    }
  }

  useEffect(() => {
    function onInvestmentsMutated() {
      mutate();
    }

    subscribe("investmentsMutated", onInvestmentsMutated);

    return () => {
      unsubscribe("investmentsMutated", onInvestmentsMutated);
    }
  }, [mutate]);

  useEffect(() => {
    // Update selected investment if it has not need deleted
    if (Array.isArray(data)) {
      const selectedInvestment = data.find((item) => item.id === selected?.id);
      setSelected(selectedInvestment ? selectedInvestment : null);
    }
  }, [data]);

  return (
    <Card
      header={{
        color: "warning",
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
      <InvestmentList investments={data || []} onClick={setSelected} />
      <CreateInvestmentDrawer open={createDrawerOpen} onClose={onCloseCreate} />
      <InvestmentDetailsDrawer open={selected !== null} onClose={() => setSelected(null)} />
    </Card>
  );
}
