import { useEffect, useState } from "react";
import { Check, Info } from "phosphor-react";

import AddTimelineEventForm from "./AddTimelineEventForm";
import { Button, KeyValue } from "@atoms/index";
import { amountForDisplay } from "@utils/Currency";
import { iconOptions } from "@utils/Global";
import { CreateInvestmentEvent, InvestmentEventType, Money } from "@utils/Types";

const infoMessages: { [key in Exclude<InvestmentEventType, "created">]: string } = {
  adjustment:
    "Submitting new real-time value will calculate adjustment by subtracting current value from entered value.",
  deposit: "Submitting new deposit will add a transaction with deposit amount.",
  withdrawal: "Submitting new withdrawal will add a transaction with withdrawal amount.",
};

interface AddTimelineEventProps {
  eventType: InvestmentEventType;
  onCreateEvent: (data: CreateInvestmentEvent) => void;
  currentInvestmentValue: Money;
}

export default function AddTimelineEvent(props: AddTimelineEventProps) {
  const [data, setData] = useState<CreateInvestmentEvent>({
    type: props.eventType,
    eventDate: new Date(),
    subtractFromBalance: true,
    valueChange: { currency: "USD", amount: 0 },
  });

  useEffect(() => {
    if (props.eventType === "adjustment") {
      setData({
        ...data,
        valueChange: props.currentInvestmentValue,
      });
    } else {
      setData({
        ...data,
        valueChange: { currency: props.currentInvestmentValue.currency, amount: 0 },
      });
    }
  }, [props.eventType]);

  return (
    <div className="addEvent">
      <div className="addEvent__values">
        {(props.eventType === "adjustment" || props.eventType === "withdrawal") && (
          <KeyValue title="Current investment value" value={amountForDisplay(props.currentInvestmentValue)} />
        )}
        {props.eventType === "adjustment" && (
          <KeyValue
            title="Calculated adjustment"
            value={amountForDisplay({
              currency: props.currentInvestmentValue.currency,
              amount: data.valueChange.amount - props.currentInvestmentValue.amount,
            })}
          />
        )}
      </div>
      <AddTimelineEventForm data={data} setData={setData} eventType={props.eventType} />
      <div className="addEvent__footer">
        <div className="addEvent__info">
          <Info className="icon" {...iconOptions} />
          <span>{infoMessages[props.eventType]}</span>
        </div>
        <Button
          centerText
          type="primary"
          icon={Check}
          onClick={() => {
            if (props.eventType === "adjustment") {
              props.onCreateEvent({
                ...data,
                type: props.eventType,
                valueChange: {
                  ...data.valueChange,
                  amount: data.valueChange.amount - props.currentInvestmentValue.amount,
                },
              });
            } else {
              props.onCreateEvent({
                ...data,
                type: props.eventType,
              });
            }
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
