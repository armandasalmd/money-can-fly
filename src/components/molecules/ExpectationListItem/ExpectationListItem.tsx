import classNames from "classnames";
import { Copy, Trash } from "phosphor-react";

import { CategoryIcon, PopConfirm } from "@atoms/index";
import { amountForDisplay } from "@utils/Currency";
import { Category, Money, MonthPrediction } from "@utils/Types";

interface ExpectationListItemProps {
  model: MonthPrediction;
  isSelected: boolean;
  hasSelected: boolean;
  onCopy(model: MonthPrediction): void;
  onDelete(model: MonthPrediction): void;
  onSelect(model: MonthPrediction): void;
}

export default function ExpectationListItem(props: ExpectationListItemProps) {
  let className = classNames("expectationListItem", {
    "expectationListItem--selected": props.isSelected,
  });
  let categoryIcon: Category = "other";

  if (props.model.totalChange > 0) {
    categoryIcon = "trendUp";
  } else if (props.model.totalChange < 0) {
    categoryIcon = "trendDown";
  }

  const date = new Date(props.model.period.from);
  const monthLabel = date.toLocaleString("default", { month: "long" });
  const change: Money = {
    amount: props.model.totalChange,
    currency: props.model.currency,
  };

  const deleteIcon = <Trash size={24} color="var(--shade40)" />;
  const copyIcon = <Copy size={24} color="var(--shade40)" onClick={(e) => {
    e.stopPropagation();
    props.onCopy(props.model);
  }} />;

  return (
    <div className={className} onClick={() => props.onSelect(props.model)}>
      <CategoryIcon category={categoryIcon} size="small" />
      <div className="expectationListItem__main">
        <h5 className="expectationListItem__title">
          {date.getMonth() + 1}. {monthLabel}
        </h5>
        <p className="expectationListItem__subtitle">Total change {amountForDisplay(change)}</p>
      </div>
      {categoryIcon !== "other" && (
        <div className="expectationListItem__actions">
          {!props.isSelected && props.hasSelected && copyIcon}
          <PopConfirm
            description={`Delete ${monthLabel} ${date.getFullYear()}`}
            placement="topRight"
            onConfirm={() => props.onDelete(props.model)}
            cancelText="Cancel"
            okText="Delete"
          >
            {deleteIcon}
          </PopConfirm>
        </div>
      )}
    </div>
  );
}
