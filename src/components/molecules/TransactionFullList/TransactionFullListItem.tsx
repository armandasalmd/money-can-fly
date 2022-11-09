import classNames from "classnames";
import { Button, CategoryIcon, Checkbox } from "@atoms/index";
import { Transaction } from "@utils/Types";

export default function TransactionFullListItem(props: Transaction) {
  const classes = classNames("tFullListItem", {
  });

  return (
    <div className={classes}>
      
      {props.description}
    </div>
  );
};
