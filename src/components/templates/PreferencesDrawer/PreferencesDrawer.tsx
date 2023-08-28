import { useRecoilState, useResetRecoilState } from "recoil";
import { useState, useEffect } from "react";

import { Drawer, Select, DatePicker, Button, Message, Input } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { PreferencesForm, preferencesState } from "@recoil/preferences/atoms";
import { currencyPreset } from "@utils/SelectItems";
import { Money } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";
import { publish } from "@utils/Events";
import { usePreferences } from "@context/PreferencesContext";
import { getRequest, putRequest } from "@utils/Api";

interface PreferencesDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export default function PreferencesDrawer(props: PreferencesDrawerProps) {
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useRecoilState(preferencesState);
  const resetState = useResetRecoilState(preferencesState);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [breakpointCountError, setBreakpointCountError] = useState("");
  const { setDefaultCurrency } = usePreferences();

  function onSave() {
    setLoading(true);
    putRequest<any>("/api/preferences/update", state)
      .then((res) => {
        const errorMessage = res.message
        
        if (!errorMessage) {
          res.forecastPivotDate = new Date(res.forecastPivotDate);

          setState(res);
          setChanged(false);
          setMessageType("success");
          setMessage("Preferences saved");
          setBreakpointCountError("");
          setDefaultCurrency(res.defaultCurrency);

          publish("cashBalanceChanged", null);
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
      })
      .finally(() => setLoading(false));
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
    setMessage("");
    setBreakpointCountError("");
  }

  const saveButton = (
    <Button type={changed ? "primary" : "default"} disabled={!changed || loading} onClick={onSave}>
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
    if (props.open) {
      if (!loading) setLoading(true);

      getRequest<PreferencesForm>("/api/preferences/read").then((res) => {
        res.forecastPivotDate = new Date(res.forecastPivotDate);

        setDefaultCurrency(res.defaultCurrency);
        setState(res);
      }).finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, setState, setDefaultCurrency]);

  return (
    <Drawer loading={loading} open={props.open} onClose={handleClose} title="Settings" size="small" extra={saveButton}>
      <div style={{ display: "flex", flexFlow: "column", gap: 16 }}>
        <Message colorType={messageType} counterMargin fadeIn messageStyle="bordered" onDismiss={() => setMessage("")}>
          {message}
        </Message>
        <h3>Preferences</h3>
        <Select
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
          goToToday
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
          goToToday
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
