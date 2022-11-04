import { Borrowing } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";
import { Button } from "@atoms/index";
import { Trash } from "phosphor-react";

export interface BorrowItemProps extends Borrowing {
  onDelete?: (borrowingId: string) => void;
}

export default function BorrowItem(props: BorrowItemProps) {
  return (
    <div className="borrowItem">
      <div className="borrowItem__main">
        <h5 className="borrowItem__title">{props.description}</h5>
        <p className="borrowItem__subtitle">{props.date}</p>
      </div>
      <h3 className="borrowItem__amount">{amountForDisplay(props.money)}</h3>
      <Trash
        className="borrowItem__delete"
        size={24}
        color="var(--shade40)"
        onClick={() => props.onDelete?.(props.id)}
      />
    </div>
  );
}
