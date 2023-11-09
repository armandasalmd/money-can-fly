import { useRecoilState, useResetRecoilState } from "recoil";
import { useState, useEffect } from "react";

import { Drawer, Select, DatePicker, Button, Message } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { PreferencesForm, preferencesState } from "@recoil/preferences/atoms";
import { currencyPreset } from "@utils/SelectItems";
import { Money } from "@utils/Types";
import { amountForDisplay } from "@utils/Currency";
import { publish } from "@utils/Events";
import { usePreferences } from "@context/PreferencesContext";
import { getRequest, patchRequest } from "@utils/Api";
import { ReadUserSettingsResponse } from "@endpoint/userSettings/read";

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
  const { setDefaultCurrency } = usePreferences();

  function onSave() {
    setLoading(true);
    patchRequest<PreferencesForm>("/api/userSettings/update", { general: state })
      .then((res) => {
        if (Object.hasOwn(res, "message")) {
          setMessageType("error");
          setMessage(res["message"]);
          return;
        }
        
        setState(res);
        setChanged(false);
        setMessageType("success");
        setMessage("User settings saved");
        setDefaultCurrency(res.defaultCurrency);

        publish("cashBalanceChanged", null);
      })
      .catch((_) => {
        setMessageType("error");
        setMessage("Error saving user setting");
      })
      .finally(() => setLoading(false));
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

      getRequest<ReadUserSettingsResponse>("/api/userSettings/read", { general: true }).then((res) => {
        setDefaultCurrency(res.general.defaultCurrency);
        setState(res.general);
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
      </div>
    </Drawer>
  );
}
