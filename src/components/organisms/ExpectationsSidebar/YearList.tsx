import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { getRequest } from "@utils/Api";
import { MonthPrediction } from "@utils/Types";
import { ExpectationListItem } from "@molecules/index";
import { selectedMonthExpectation } from "@recoil/expectations/atoms";
import { subscribe, unsubscribe } from "@utils/Events";
import { deleteRequest } from "@utils/Api";

interface YearListProps {
  year: number;
  setLoading: (loading: boolean) => void;
}

export default function YearList(props: YearListProps) {
  const [expectations, setExpectations] = useState<MonthPrediction[]>([]);
  const [selected, setSelected] = useRecoilState(selectedMonthExpectation);

  useEffect(() => {
    function onExpectationSaved({ detail }: { detail: MonthPrediction }) {
      setExpectations(expectations.map(o => o.id === detail.id ? detail : o));
      // console.log("SAVED", expectations.findIndex(o => o.id === detail.id));
    }

    subscribe("expectationSaved", onExpectationSaved);
    return () => unsubscribe("expectationSaved", onExpectationSaved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fn() {
      let response = await getRequest<MonthPrediction[]>("/api/predictions/read", { year: props.year });
      setExpectations(response || []);
      props.setLoading(false);
    }

    fn();

    return () => setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.year]);

  function onCopy(model: MonthPrediction) {
    setSelected({
      id: selected.id,
      period: selected.period,
      currency: model.currency,
      predictions: model.predictions.map(o => ({...o})),
      totalChange: model.predictions.reduce((acc, curr) => acc + curr.moneyIn - curr.moneyOut, 0)
    });
  }

  function onDelete(model: MonthPrediction) {
    if (!model.id) return;
    
    deleteRequest("/api/predictions/resetPeriod", { predictionId: model.id });

    props.setLoading(true);
    fn();
    
    async function fn() {
      let response = await getRequest<MonthPrediction[]>("/api/predictions/read", { year: props.year });
      setExpectations(response || []);
      props.setLoading(false);
    }
    // console.log("SAVED", expectations.findIndex(o => o.id === detail.id));
  }

  function onSelect(model: MonthPrediction) {
    setSelected(selected === model ? null : model);
  }

  return (
    <div>
      {expectations.map((o, index) => (
        <ExpectationListItem
          key={o.period?.from?.toString() || index}
          isSelected={o === selected}
          hasSelected={!!selected}
          model={o}
          onCopy={onCopy}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
