import { useState } from "react";
import { WeekPrediction } from "@utils/Types";
import { Input } from "@atoms/index";
import { parseCurrency } from "@utils/Currency";

interface WeekPredictionItemProps {
  week: WeekPrediction;
  onChange: (week: WeekPrediction) => void;
}

export default function WeekPredictionItem(props: WeekPredictionItemProps) {
  const [inValue, setInValue] = useState(
    props.week.moneyIn === 0 ? "" : props.week.moneyIn.toString()
  );
  const [outValue, setOutValue] = useState(
    props.week.moneyOut === 0 ? "" : props.week.moneyOut.toString()
  );

  function inputChange(value: string, name: string) {
    let num = parseCurrency(value, true);

    if (!isNaN(num)) {
      props.onChange({ ...props.week, [name]: num });
  
      if (name === "moneyIn") {
        setInValue(value);
      } else {
        setOutValue(value);
      }
    }
  }

  return (
    <div className="predictionForm__week">
      <div className="predictionForm__weekLabel">{props.week.label}</div>
      <Input
        placeholder="Money in"
        name="moneyIn"
        onChange={inputChange}
        value={inValue}
        title="Money in"
      />
      <Input
        placeholder="Money out"
        name="moneyOut"
        onChange={inputChange}
        value={outValue}
        title="Money out"
      />
    </div>
  );
}
