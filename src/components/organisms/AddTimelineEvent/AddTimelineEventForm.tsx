import { Checkbox, DatePicker } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { CreateInvestmentEvent, InvestmentEventType, Money } from "@utils/Types";

interface AddTimelineEventFormProps {
  eventType: InvestmentEventType;
  data: CreateInvestmentEvent;
  setData: (data: CreateInvestmentEvent) => void;
}

const amountTitles: { [key in Exclude<InvestmentEventType, "created">]: string } = {
  adjustment: "What is real-time total value?",
  deposit: "Amount to deposit",
  withdrawal: "What amount would you like to cash out?",
};

export default function AddTimelineEventForm(props: AddTimelineEventFormProps) {
  function onCheckChange(value: boolean) {
    props.setData({
      ...props.data,
      subtractFromBalance: value,
    });
  }

  function onDateChange(date: Date) {
    props.setData({
      ...props.data,
      eventDate: date,
    });
  }

  function onValueChange(valueChange: Money) {
    props.setData({
      ...props.data,
      valueChange,
    });
  }

  return (
    <div className="addEventForm">
      <DatePicker title="Event timestamp" value={new Date(props.data.eventDate)} onSelect={onDateChange} />
      <CurrencyInput
        title={amountTitles[props.eventType]}
        value={props.data.valueChange}
        onChange={onValueChange}
        onlyPositive
        disableCurrencyChange
      />
      {props.eventType === "deposit" && (
        <Checkbox
          horizontal
          title="Subtract equivalent amount from cash balance"
          value={props.data.subtractFromBalance ? "checked" : "unchecked"}
          onChange={onCheckChange}
        />
      )}
    </div>
  );
}
