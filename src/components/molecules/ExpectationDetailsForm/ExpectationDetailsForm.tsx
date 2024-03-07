import { useState, useEffect } from "react";

import { Button, Select } from "@atoms/index";
import { ExpectationFormRow } from "@molecules/index";
import { currencyPreset } from "@utils/SelectItems";
import { round } from "@server/utils/Global";
import { putRequest } from "@utils/Api";
import { getLastDayOfMonth } from "@utils/Date";
import { Currency, MonthPrediction, SuccessResponse, WeekPrediction } from "@utils/Types";
import { SetPeriodRequest } from "@endpoint/predictions/setPeriod";
import { publish } from "@utils/Events";
import { IPeriodPredictionModel, PeriodPredictionModel } from '@server/models';

function cloneExpectation(expectation: MonthPrediction): MonthPrediction {
  return {
    ...expectation,
    predictions: expectation.predictions.map((o) => ({ ...o })),
  };
}

interface ExpectationDetailsFormProps {
  selectedExpectation: MonthPrediction;
}

export default function ExpectationDetailsForm(props: ExpectationDetailsFormProps) {
  const [formState, setFormState] = useState<MonthPrediction>(cloneExpectation(props.selectedExpectation));
  const [savedIndicator, setSavedIndicator] = useState(false);

  const totalItem: WeekPrediction = {
    moneyIn: round(formState.predictions.reduce((acc, curr) => acc + curr.moneyIn, 0)),
    moneyOut: round(formState.predictions.reduce((acc, curr) => acc + curr.moneyOut, 0)),
    week: -1,
  };

  function onCurrencyChange(currency: Currency) {
    setFormState({ ...formState, currency });
  }

  function onChange(week: WeekPrediction) {
    setFormState({
      ...formState,
      predictions: formState.predictions.map(o => o.week === week.week ? week : o)
    });
  }

  function onSave() {
    if (savedIndicator) return;
    putRequest<SuccessResponse<IPeriodPredictionModel>>("/api/predictions/setPeriod", {
      currency: formState.currency,
      periodMonth: new Date(formState.period.from).toISOString(),
      predictions: formState.predictions
    } as SetPeriodRequest).then((response) => {
      setSavedIndicator(true);
      setTimeout(() => {
        setSavedIndicator(false);
      }, 2000);

      if (!formState.id) {
        formState.id = response?.data?._id; // if previously not saved item was saved, attach new id
      }

      formState.totalChange = formState.predictions.reduce((acc, curr) => acc + curr.moneyIn - curr.moneyOut, 0);

      // Update sidebar (Year list)
      publish("expectationSaved", formState);
    });
  }

  useEffect(() => {
    if (props.selectedExpectation) {
      setFormState(cloneExpectation(props.selectedExpectation));
    }
    // eslint-disable-next-line
  }, [props.selectedExpectation]);

  let formRows = formState.predictions.map((o) => (
    <ExpectationFormRow lastDayOfMonth={getLastDayOfMonth(formState.period.from)} onChange={onChange} showTitle={o.week === 1} week={o} key={o.week} />
  ));

  return (
    <div className="expectationDetailsForm">
      <div className="expectationDetailsForm__main">
        {formRows}
        <ExpectationFormRow onChange={() => {}} week={totalItem} />
      </div>
      <div className="expectationDetailsForm__footer">
        <Select items={currencyPreset} required value={formState.currency} onChange={onCurrencyChange} />
        <Button disabled={savedIndicator} wrapContent type="primary" onClick={onSave}>
          {savedIndicator ? "Changes saved" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
