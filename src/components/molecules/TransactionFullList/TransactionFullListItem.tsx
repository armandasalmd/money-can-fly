import { createElement } from "react";
import classNames from "classnames";
import { PencilSimple, CalendarCheck, Airplay } from "phosphor-react";

import { CategoryIcon, Checkbox } from "@atoms/index";

import { amountForDisplay } from "@utils/Currency";
import { toDisplayDate } from "@utils/Date";
import { capitalise, iconOptions } from "@utils/Global";
import { Transaction } from "@utils/Types";
import { format } from "date-fns";

export interface TransactionFullListItemProps {
  transaction: Transaction;
  selected: boolean;
  onEdit: (transaction: Transaction) => void;
  onSelect: (transaction: Transaction) => void;
}

export default function TransactionFullListItem(props: TransactionFullListItemProps) {
  const classes = classNames("tFullListItem", {
    "tFullListItem--selected": props.selected,
  });

  return (
    <div className={classes}>
      <div className="tFullListItem__main">
        <div className="tFullListItem__category">
          <CategoryIcon category={props.transaction.category} size="medium" />
        </div>
        <p className="tFullListItem__bank">{capitalise(props.transaction.source)} account{props.transaction.isImported && " (Imported)"}</p>
        <div className="tFullListItem__label">
          <h3>{props.transaction.description}</h3>
          <span
            className={classNames("tFullListItem__amount", {
              "tFullListItem__amount--negative": props.transaction.amount < 0,
            })}
          >
            {amountForDisplay(props.transaction)}
          </span>
        </div>
      </div>
      <div className="tFullListItem__otherDetails">
        <div className="tFullListItem__detail">
          <CalendarCheck {...iconOptions} />
          <p>{format(new Date(props.transaction.date), "yyyy-MM-dd • HH:mm")}</p>
        </div>
        <div className="tFullListItem__detail">
          <Airplay {...iconOptions} />
          <p>Updated {toDisplayDate(props.transaction.dateUpdated || props.transaction.date)}</p>
        </div>
      </div>
      {props.transaction.isInvestment !== true && (
        <div className="tFullListItem__actions">
          <div className="tFullListItem__action" onClick={() => props.onSelect(props.transaction)}>
            <Checkbox value={props.selected ? "checked" : "unchecked"} />
          </div>
          <div className="tFullListItem__action" onClick={() => props.onEdit(props.transaction)}>
            {createElement(PencilSimple, iconOptions)}
          </div>
        </div>
      )}
    </div>
  );
}
