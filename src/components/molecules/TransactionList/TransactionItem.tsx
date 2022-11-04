import classNames from "classnames";
import { Trash } from "phosphor-react";
import formatISO from "date-fns/formatISO";

import { Transaction } from "@utils/Types";
import { CategoryIcon } from "@atoms/index";
import { amountForDisplay } from "@utils/Currency";

export interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export default function TransactionItem(props: TransactionItemProps) {
  const { transaction: t } = props;
  const isPositive = t.amount >= 0;

  return (
    <div
      className={classNames("tItem", {
        "tItem--positive": isPositive,
      })}
    >
      <CategoryIcon category={t.category} size="small" />
      <div className="tItem__main">
        <h5 className="tItem__title">{t.description}</h5>
        <p className="tItem__subtitle">
          {formatISO(t.date, { representation: "date" })}
        </p>
      </div>
      <h3 className="tItem__amount">{amountForDisplay(t)}</h3>
      <Trash
        className="tItem__delete"
        size={24}
        color="var(--shade40)"
        onClick={() => props.onDelete?.(t.id)}
      />
    </div>
  );
}
