import { useRecoilState, useResetRecoilState } from "recoil";
import { useState, useEffect } from "react";

import { Drawer, Select, DatePicker, Button, Message, Input } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { PreferencesForm, preferencesState } from "@recoil/preferences/atoms";
import { currencyPreset } from "@utils/SelectItems";
import { Money } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";

interface PreferencesDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export default function PreferencesDrawer(props: PreferencesDrawerProps) {
  const [changed, setChanged] = useState(false);
  const [state, setState] = useRecoilState(preferencesState);
  const resetState = useResetRecoilState(preferencesState);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [breakpointCountError, setBreakpointCountError] = useState("");

  function onSave() {
    fetch("/api/preferences/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    })
      .then((res) => res.json())
      .then((res) => {
        const errorMessage = res.message
        
        if (!errorMessage) {
          res.forecastPivotDate = new Date(res.forecastPivotDate);

          setState(res);
          setChanged(false);
          setMessageType("success");
          setMessage("Preferences saved");
          setBreakpointCountError("");
        } else if (res.fieldErrors.balanceChartBreakpoints) {
          setBreakpointCountError(res.fieldErrors.balanceChartBreakpoints);
        } else {
          setMessageType("error");
          setMessage(errorMessage);
        }
      })
      .catch((_) => {
        setMessageType("error");
        setMessage("Error saving preferences");
      });
  }

  function onBreakpointCountChange(value: string) {
    const breakpointCount = parseInt(value);

    onInputChange(isNaN(breakpointCount) ? 0 : breakpointCount, "balanceChartBreakpoints");
  }

  function onInputChange(value: string | number | Date, name: string) {
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
        [value.currency]: value,
      },
    });
  }

  function handleClose() {
    props.onClose(false);

    resetState();
    setChanged(false);
  }

  const saveButton = (
    <Button type={changed ? "primary" : "default"} disabled={!changed} onClick={onSave}>
      Save
    </Button>
  );

  const now = new Date();
  const monthlyBudgetStartDay = new Date(now.getFullYear(), now.getMonth(), state.monthlyBudgetStartDay);

  const currencyBalanceInputs = Object.values(state.balances)?.map((value: Money) => {
    return (
      <CurrencyInput
        disableCurrencyChange
        required
        key={value.currency}
        value={value}
        placeholder={amountForDisplay(value)}
        title={`Override ${value.currency} balance`}
        onlyPositive
        onChange={onBalanceChange}
      />
    );
  });

  useEffect(() => {
    async function fetchPreferences(): Promise<PreferencesForm> {
      return fetch("/api/preferences/read").then((res) => res.json());
    }

    if (props.open) {
      fetchPreferences().then((res) => {
        res.forecastPivotDate = new Date(res.forecastPivotDate);

        setState(res);
      });
    }
  }, [props.open, setState]);

  return (
    <Drawer open={props.open} scrollable onClose={handleClose} title="Settings" size="small" extra={saveButton}>
      <div style={{ display: "flex", flexFlow: "column", gap: 16 }}>
        <Message colorType={messageType} counterMargin fadeIn messageStyle="bordered" onDismiss={() => setMessage("")}>
          {message}
        </Message>
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
        <h3>Cash balance</h3>
        {currencyBalanceInputs}
        <h3>Balance analysis chart</h3>
        <DatePicker
          required
          title="Forecast pivot date"
          name="forecastPivotDate"
          onSelect={onInputChange}
          value={state.forecastPivotDate}
        />
        <CurrencyInput
          disableCurrencyChange
          title="Forecast pivot value"
          required
          name="forecastPivotValue"
          onChange={(money, name) => onInputChange(money.amount, name)}
          value={{
            amount: state.forecastPivotValue,
            currency: state.defaultCurrency,
          }}
          onlyPositive
        />
        <Input
          required
          error={breakpointCountError}
          title="Date breakpoint count"
          placeholder="Value between 6 and 16"
          value={state.balanceChartBreakpoints.toString()}
          setValue={onBreakpointCountChange}
        />
      </div>
    </Drawer>
  );
}
