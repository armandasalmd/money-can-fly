import { amountForDisplay } from "@utils/Currency";
import { toDisplayDate } from "@utils/Global";
import { Investment } from "@utils/Types";
import { AlignCenterVertical } from "phosphor-react";

interface InvestmentListItemProps {
  investment: Investment;
  onClick: (investment: Investment) => void;
}

export function InvestmentListItem(props: InvestmentListItemProps) {
  const { investment, onClick } = props;

  return (
    <div className="investmentListItem" onClick={() => onClick(investment)} title="Edit timeline">
      <div className="investmentListItem__main">
        <h5 className="investmentListItem__title">{investment.title}</h5>
        <p className="investmentListItem__subtitle">
          {props.investment.timelineEvents.length} timeline events • {toDisplayDate(props.investment.dateModified)}
        </p>
      </div>
      <div className="investmentListItem__right">
        <h3 className="investmentListItem__amount">{amountForDisplay(props.investment.currentValue)}</h3>
        <AlignCenterVertical className="investmentListItem__action" size={24} color="var(--shade60)" />
      </div>
    </div>
  );
}
