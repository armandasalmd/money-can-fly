import { useState, useEffect } from "react";

import { WeekPrediction, MonthPrediction, DateRange } from "@utils/Types";
import { Button, DatePeriodSelect, Select } from "@atoms/index";
import { currencyPreset } from "@utils/SelectItems";
import WeekPredictionItem from "./WeekPredictionItem";
import { monthPredictionFormState } from "@recoil/predictions/atoms";
import { useRecoilState } from "recoil";

export interface CreateUpdatePredictionFormProps {
  onSubmit: (prediction: MonthPrediction, isEmpty: boolean) => void;
  loading: boolean;
}

export default function CreateUpdatePredictionForm(props: CreateUpdatePredictionFormProps) {
  const [formState, setFormState] = useRecoilState(monthPredictionFormState);
  const [totalPrediction, setTotalPrediction] = useState<WeekPrediction | null>(null);

  function inputChange(value: string | DateRange, name: string) {
    setFormState({ ...formState, [name]: value });
  }

  function weekPredictionChange(week: WeekPrediction) {
    const predictions = formState.predictions.map((w) => (w.week === week.week ? week : w));
    setFormState({ ...formState, predictions });
  }

  useEffect(() => {
    setTotalPrediction({
      week: -1,
      label: "Total",
      moneyIn: formState.predictions.reduce((acc, o) => acc + o.moneyIn, 0),
      moneyOut: formState.predictions.reduce((acc, o) => acc + o.moneyOut, 0),
    });
  }, [formState]);

  return (
    <div className="predictionForm">
      <div className="predictionForm__item predictionForm__item--double">
        <DatePeriodSelect
          title="Monthly period"
          value={formState.period}
          monthsAhead={12}
          monthsBehind={12}
          onChange={(range: DateRange) => {
            setFormState({
              ...formState,
              period: range,
            });
          }}
        />
        <Select
          items={currencyPreset}
          title="Currency"
          name="currency"
          required
          value={formState.currency}
          onChange={inputChange}
        />
      </div>
      <div className="predictionForm__divider" />
      <p className="predictionForm__tip">Enter the amount you expect to spend each week below</p>
      <div className="predictionForm__item">
        {formState.predictions.map((week) => (
          <WeekPredictionItem key={week.week} week={week} onChange={weekPredictionChange} />
        ))}
        {totalPrediction && (
          <WeekPredictionItem key={totalPrediction.week} week={totalPrediction} onChange={() => {}} />
        )}
      </div>
      <Button
        disabled={props.loading}
        centerText
        className="predictionForm__item"
        onClick={() => props.onSubmit(formState, totalPrediction.moneyIn === 0 && totalPrediction.moneyOut === 0)}
        type="primary"
      >
        {props.loading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
