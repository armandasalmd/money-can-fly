import { format } from "date-fns";
import { Trash } from "phosphor-react";

import { InvestmentEvent } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";
import { iconOptions } from "@utils/Global";

interface TimelineItemProps {
  itemNumber: number;
  investmentEvent: InvestmentEvent;
  onDelete: (investmentEvent: InvestmentEvent) => void;
}

export default function TimelineItem(props: TimelineItemProps) {
  const { title, eventDate, total, type } = props.investmentEvent;

  return (
    <div className="timelineItem">
      <div className="timelineItem__number center">
        <span>{props.itemNumber}</span>
      </div>
      <div className="timelineItem__main">
        <div className="timelineItem__title">{title}</div>
        {total && <div className="timelineItem__desc">Total value becomes {amountForDisplay(total)}</div>}
        <div className="timelineItem__date">{format(eventDate, "yyyy-MM-dd HH:mm")}</div>
      </div>
      <div
        onClick={() => props.onDelete(props.investmentEvent)}
        className="timelineItem__delete center"
        title={type === "created" ? "Delete entire investment" : "Delete single event"}
      >
        <Trash {...iconOptions} size={22} />
      </div>
    </div>
  );
}
