import { useState } from "react";
import { useRecoilState } from "recoil";

import { selectedInvestment } from "@recoil/dashboard/atoms";
import TimelineItem from "./TimelineItem";
import { Empty, MessageColor, Select } from "@atoms/index";
import { InvestmentEvent, Sort } from "@utils/Types";
import { sortPreset } from "@utils/SelectItems";
import { amountForDisplay } from "@utils/Currency";
import { publish } from "@utils/Events";

interface InvestmentTimelineProps {
  displayMessage: (message: string, messageType: MessageColor) => void;
}

export default function InvestmentTimeline(props: InvestmentTimelineProps) {
  const [sort, setSort] = useState<string>("desc" as Sort);
  const [investment, setInvestment] = useRecoilState(selectedInvestment);

  function onDelete(investmentEvent: InvestmentEvent) {
    fetch("/api/investments/deleteEvent", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: investmentEvent._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          publish("investmentsMutated", null);

          const copy = [...investment.timelineEvents];
          const index = copy.findIndex((item) => item._id === investmentEvent._id);
          copy.splice(index, 1);
          setInvestment({ ...investment, timelineEvents: copy });

          props.displayMessage(`Event "${investmentEvent.title}" deleted`, "success");
        } else {
          props.displayMessage("Unexpected error", "error");
        }
      })
      .catch((err) => {
        props.displayMessage("Unexpected error", "error");
      });
  }

  if (!investment || !investment.timelineEvents || investment.timelineEvents.length === 0)
    return <Empty text="Timeline is empty" />;

  const copy: InvestmentEvent[] = [...investment.timelineEvents];

  if (Array.isArray(copy)) {
    for (let i = 0; i < copy.length; i++) {
      for (let j = i + 1; j < copy.length; j++) {
        if (
          (sort === "asc" && copy[i].eventDate.getTime() > copy[j].eventDate.getTime()) ||
          (sort === "desc" && copy[i].eventDate.getTime() < copy[j].eventDate.getTime())
        ) {
          const temp = copy[i];
          copy[i] = copy[j];
          copy[j] = temp;
        }
      }
    }
  }

  return (
    <div className="investmentTimeline">
      <div className="investmentTimeline__header">
        <p>Current value {amountForDisplay(investment.currentValue)}</p>
        <Select fixedWidthSmall onChange={setSort} required value={sort} items={sortPreset} />
      </div>
      {copy.map((investmentEvent, index) => (
        <TimelineItem
          onDelete={onDelete}
          key={index}
          itemNumber={sort === "asc" ? index + 1 : copy.length - index}
          investmentEvent={investmentEvent}
        />
      ))}
    </div>
  );
}
