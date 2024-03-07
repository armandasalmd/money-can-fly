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
      let indexOfMonthUpdated = expectations.findIndex(o => o.period.from === detail.period.from);
      if (indexOfMonthUpdated >= 0) {
        expectations[indexOfMonthUpdated] = { ...detail };
      }

      setSelected(expectations[indexOfMonthUpdated]);
      setExpectations(expectations);
    }

    subscribe("expectationSaved", onExpectationSaved);
    return () => unsubscribe("expectationSaved", onExpectationSaved);
  }, [setExpectations, setSelected, expectations]);

  useEffect(() => {
    async function fn() {
      let response = await getRequest<MonthPrediction[]>("/api/predictions/read", { year: props.year });
      setExpectations(response || []);
      props.setLoading(false);
    }

    fn();
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
    
    props.setLoading(true);

    deleteRequest("/api/predictions/resetPeriod", { predictionId: model.id })
      .then(async () => {
        let response = await getRequest<MonthPrediction[]>("/api/predictions/read", { year: props.year });
        setExpectations(response || []);
        setSelected((selected && response?.find(o => o.id === selected.id)) || null);
      })
      .finally(() => {
        props.setLoading(false);
      });
  }

  function onSelect(model: MonthPrediction) {
    setSelected(selected === model ? null : model);
  }

  return (
    <div>
      {expectations.map((o) => (
        <ExpectationListItem
          key={new Date(o.period.from).toISOString()}
          isSelected={o.period.from === selected?.period?.from}
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
