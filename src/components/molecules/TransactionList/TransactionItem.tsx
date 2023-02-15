import classNames from "classnames";
import { Trash } from "phosphor-react";
import { format } from "date-fns";

import { Transaction } from "@utils/Types";
import { CategoryIcon, PopConfirm } from "@atoms/index";
import { amountForDisplay } from "@utils/Currency";

export interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export default function TransactionItem(props: TransactionItemProps) {
  const { transaction: t } = props;
  const deleteIcon = <Trash className="tItem__delete" size={24} color="var(--shade40)" />;

  return (
    <div
      className={classNames("tItem", {
        "tItem--positive": t.amount >= 0,
        "tItem--investment": t.category === "investments",
      })}
    >
      <CategoryIcon category={t.category} size="small" />
      <div className="tItem__main">
        <h5 className="tItem__title">{t.description}</h5>
        <p className="tItem__subtitle">{format(t.date, "yyyy-MM-dd • HH:mm")}</p>
      </div>
      <h3 className="tItem__amount">{amountForDisplay(t)}</h3>
      {t.isInvestment === true && (
        <PopConfirm
          description="Delete associated investment event to pop this transaction"
          placement="topRight"
          cancelText="Ok"
          title="Cannot delete"
        >
          {deleteIcon}
        </PopConfirm>
      )}
      {t.isInvestment !== true && (
        <PopConfirm
          description={`Delete ${t.description}`}
          placement="topRight"
          onConfirm={() => props.onDelete?.(t._id)}
          cancelText="Cancel"
          okText="Delete"
        >
          {deleteIcon}
        </PopConfirm>
      )}
    </div>
  );
}
