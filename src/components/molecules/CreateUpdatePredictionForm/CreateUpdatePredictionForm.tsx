import { useState } from "react";
import { DateRange } from "react-day-picker";

import { WeekPrediction, MonthPrediction } from "@utils/Types";
import { Button, DatePeriodSelect, Select, getPeriodNow } from "@atoms/index";
import { defaultCurrency } from "@utils/SelectItems";
import WeekPredictionItem from "./WeekPredictionItem";

export interface CreateUpdatePredictionFormProps {
  prediction?: MonthPrediction;
  onSubmit: (prediction: MonthPrediction) => void;
}

function getDefaultWeekPrediction(): WeekPrediction[] {
  const weeks: WeekPrediction[] = [];

  for (let i = 1; i <= 4; i++) {
    weeks.push({
      label: `Day ${(i - 1) * 7 + 1} - ${i * 7}`,
      week: i,
      moneyIn: 0,
      moneyOut: 0,
    });
  }

  weeks.push({
    label: `Day 29 - End`,
    week: 5,
    moneyIn: 0,
    moneyOut: 0,
  });

  return weeks;
}

export default function CreateUpdatePredictionForm(
  props: CreateUpdatePredictionFormProps
) {
  const [formState, setFormState] = useState<MonthPrediction>(
    props.prediction || {
      month: getPeriodNow(),
      currency: "GBP",
      predictions: getDefaultWeekPrediction(),
    }
  );

  function inputChange(value: string | DateRange, name: string) {
    setFormState({ ...formState, [name]: value });
  }

  function weekPredictionChange(week: WeekPrediction) {
    const predictions = formState.predictions.map((w) =>
      w.week === week.week ? week : w
    );
    setFormState({ ...formState, predictions });
  }

  return (
    <div className="predictionForm">
      <div className="predictionForm__item predictionForm__item--double">
        <DatePeriodSelect
          title="Monthly period"
          value={formState.month}
          monthsAhead={12}
          monthsBehind={12}
          onChange={(range: DateRange) => {
            setFormState({
              ...formState,
              month: range,
            });
          }}
        />
        <Select
          items={defaultCurrency}
          title="Currency"
          name="currency"
          required
          value={formState.currency}
          onChange={inputChange}
        />
      </div>
      <div className="predictionForm__divider" />
      <p className="predictionForm__tip">
        Enter the amount you predict to spend each week below
      </p>
      <div className="predictionForm__item">
        {formState.predictions.map((week) => (
          <WeekPredictionItem
            key={week.week}
            week={week}
            onChange={weekPredictionChange}
          />
        ))}
      </div>
      <Button
        centerText
        className="predictionForm__item"
        onClick={() => props.onSubmit(formState)}
        type="primary"
      >
        Save
      </Button>
    </div>
  );
}
