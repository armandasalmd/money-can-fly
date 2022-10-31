import classNames from "classnames";
import { Transaction } from "@utils/Types";
import { CategoryIcon } from "@atoms/index";

export default function TransactionItem(props: Transaction) {
  return (
    <div className={classNames("tItem", {
      "tItem--positive": props.amount > 0,
    })}>
      <CategoryIcon category={props.category} size="small" />
      <div className="tItem__main">
        <h5 className="tItem__title">{props.description}</h5>
        <p className="tItem__subtitle">{props.date}</p>
      </div>
      <h3 className="tItem__amount">{props.amount}</h3>
    </div>
  );
}
