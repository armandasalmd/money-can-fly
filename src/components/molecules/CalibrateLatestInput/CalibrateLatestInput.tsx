import { Plus, Minus } from "phosphor-react";

import { Button } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { Money } from "@utils/Types";

export type UpdateTargetCommand = "subtract" | "set" | "add";

interface CalibrateLatestInputProps {
  value: Money;
  setValue(value: Money): void;
  onCommand(command: UpdateTargetCommand, money: Money): void;
}

export default function CalibrateLatestInput(props: CalibrateLatestInputProps) {
  function onUpdate(command: UpdateTargetCommand) {
    props.onCommand(command, props.value);

    if (command !== "set") {
      props.setValue({
        amount: 0,
        currency: props.value.currency,
      });
    }
  }

  return (
    <div className="calibrateLatestInput">
      <CurrencyInput onlyPositive value={props.value} onChange={props.setValue} onSubmit={() => onUpdate("set")} fixedWidth title="Update target column" />
      <Button icon={Minus} wrapContent tooltip="Subtract input amount" onClick={() => onUpdate("subtract")} />
      <Button wrapContent onClick={() => onUpdate("set")}>
        Set
      </Button>
      <Button icon={Plus} wrapContent tooltip="Add input amount" onClick={() => onUpdate("add")} />
    </div>
  );
}
