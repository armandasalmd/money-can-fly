import { useRecoilState, useResetRecoilState } from "recoil";
import { useState } from "react";

import { Drawer, Select, DatePicker, Button } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { preferencesState } from "@recoil/preferences/atoms";
import { currencyPreset } from "@utils/SelectItems";
import { Currency, Money } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";

interface PreferencesDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export default function PreferencesDrawer(props: PreferencesDrawerProps) {
  const [changed, setChanged] = useState(false);
  const [state, setState] = useRecoilState(preferencesState);
  const resetState = useResetRecoilState(preferencesState);

  function onSave() {
    console.log("Save", state);
  }

  function onInputChange(value: string | number, name: string) {
    if (changed === false) {
      setChanged(true);
    }

    setState({
      ...state,
      [name]: value,
    });
  }

  function onBalanceChange(value: Money) {
    if (changed === false) {
      setChanged(true);
    }

    setState({
      ...state,
      balances: {
        ...state.balances,
        [value.currency]: value.amount,
      }
    });
  }

  function handleClose() {
    props.onClose(false);

    resetState();
    setChanged(false);
  }

  const saveButton = (
    <Button
      type={changed ? "primary" : "default"}
      disabled={!changed}
      onClick={onSave}
    >
      Save
    </Button>
  );

  const now = new Date();
  const monthlyBudgetStartDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    state.monthlyBudgetStartDay
  );

  const currencyBalanceInputs = Object.entries(state.balances)?.map(([key, value]) => {
    const money: Money = {
      amount: value as number,
      currency: key as Currency
    };

    return (
      <CurrencyInput
        disableCurrencyChange
        required
        key={key}
        value={money}
        placeholder={amountForDisplay(money)}
        title={`Adjust ${money.currency} balance`}
        onlyPositive
        onChange={onBalanceChange}
      />
    );
  });

  return (
    <Drawer
      open={props.open}
      onClose={handleClose}
      title="Settings"
      size="small"
      extra={saveButton}
    >
      <div
        style={{ display: "flex", flexFlow: "column", gap: 16 }}
      >
        <h3>Preferences</h3>
        <Select
          placeholder="All"
          required
          items={currencyPreset}
          title="Default currency"
          value={state.defaultCurrency}
          name="defaultCurrency"
          onChange={onInputChange}
        />
        <CurrencyInput
          disableCurrencyChange
          title="Monthly bugdet"
          required
          name="monthlyBudget"
          onChange={(money, name) => onInputChange(money.amount, name)}
          value={{
            amount: state.monthlyBudget,
            currency: state.defaultCurrency,
          }}
          onlyPositive
        />
        <DatePicker
          required
          title="Monthly budget start day"
          name="monthlyBudgetStartDay"
          onSelect={(date, name) => onInputChange(date.getDate(), name)}
          value={monthlyBudgetStartDay}
        />
        <h3>Account balance</h3>
        {currencyBalanceInputs}
      </div>
    </Drawer>
  );
}
