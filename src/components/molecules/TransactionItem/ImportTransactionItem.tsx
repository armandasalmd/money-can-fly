import classNames from "classnames";
import { Eye } from "phosphor-react";
import { format } from "date-fns";

import { Transaction } from "@utils/Types";
import { CategoryIcon, PopConfirm } from "@atoms/index";
import { amountForDisplay } from "@utils/Currency";

export interface TransactionItemProps {
  transaction: Transaction;
  onSetActive?: (importItem: Transaction) => void;
}

export default function ImportTransactionItem(props: TransactionItemProps) {
  const { transaction: t } = props;
  const eyeIcon = <Eye className="tItem__icon" size={24} color="var(--shade40)" onClick={props.onSetActive.bind(this, props.transaction)} />;

  return (
    <div
      className={classNames("tItem", {
        "tItem--positive": t.amount >= 0,
        "tItem--investment": t.category === "investments",
        "tItem--inactive": !t.isActive
      })}
    >
      <CategoryIcon category={t.category} size="small" />
      <div className="tItem__main">
        <h5 className="tItem__title">{t.description}</h5>
        <p className="tItem__subtitle">{format(new Date(t.date), "yyyy-MM-dd • HH:mm")}</p>
      </div>
      <h3 className="tItem__amount">{amountForDisplay(t)}</h3>
      {eyeIcon}
    </div>
  );
}
