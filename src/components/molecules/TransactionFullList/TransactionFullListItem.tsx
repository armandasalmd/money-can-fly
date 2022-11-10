import classNames from "classnames";
import {
  Eye,
  EyeClosed,
  PencilSimple,
  CalendarCheck,
  Airplay,
} from "phosphor-react";

import { Button, CategoryIcon, Checkbox } from "@atoms/index";
import { Transaction } from "@utils/Types";
import { capitalise, toDisplayDate, iconOptions } from "@utils/Global";
import { amountForDisplay } from "@utils/Currency";
import { createElement } from "react";

export interface TransactionFullListItemProps {
  transaction: Transaction;
  selected: boolean;
  onSelect: (transaction: Transaction) => void;
}

export default function TransactionFullListItem(
  props: TransactionFullListItemProps
) {
  const classes = classNames("tFullListItem", {
    "tFullListItem--selected": props.selected,
  });

  return (
    <div className={classes}>
      <div className="tFullListItem__main">
        <div className="tFullListItem__category">
          <CategoryIcon category={props.transaction.category} size="medium" />
        </div>
        <p className="tFullListItem__bank">
          {capitalise(props.transaction.source)} account
        </p>
        <div className="tFullListItem__label">
          <h3>{props.transaction.description}</h3>
          <span className={classNames("tFullListItem__amount", {
            "tFullListItem__amount--negative": props.transaction.amount < 0,
          })}>
            {amountForDisplay(props.transaction)}
          </span>
        </div>
      </div>
      <div className="tFullListItem__otherDetails">
        <div className="tFullListItem__detail">
          <CalendarCheck {...iconOptions} />
          <p>Transaction {toDisplayDate(props.transaction.date)}</p>
        </div>
        <div className="tFullListItem__detail">
          <Airplay {...iconOptions} />
          <p>Inserted {toDisplayDate(props.transaction.inserted)}</p>
        </div>
      </div>
      <div className="tFullListItem__actions">
        <div className="tFullListItem__action" onClick={() => props.onSelect(props.transaction)}>
          <Checkbox value={props.selected ? "checked" : "unchecked"} />
        </div>
        <div className="tFullListItem__action">
          {createElement(props.transaction?.active ? Eye : EyeClosed, iconOptions)}
        </div>
        <div className="tFullListItem__action">
          {createElement(PencilSimple, iconOptions)}
        </div>
      </div>
    </div>
  );
}
