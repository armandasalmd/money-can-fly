import { useState, useEffect } from "react";

import { Drawer, Select, DatePicker, Button, Message, Input, Checkbox } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { chartColorPreset } from "@utils/SelectItems";
import { usePreferences } from "@context/PreferencesContext";
import { getRequest, patchRequest } from "@utils/Api";
import { ReadUserSettingsResponse } from "@endpoint/userSettings/read";
import { IBalanceAnalysisSection } from "@server/models";
import { toCheckState } from "@utils/Global";
import { publish } from "@utils/Events";

interface BalanceAnalysisSettingsDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export default function BalanceAnalysisSettingsDrawer(props: BalanceAnalysisSettingsDrawerProps) {
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<IBalanceAnalysisSection>({
    defaultDaysAfterNow: 0,
    defaultDaysBeforeNow: 0,
    forecastPivotDate: new Date(),
    forecastPivotValue: 0,
    hideInvestmentsOnLoad: false,
    investmentColor: "yellow",
    predictionColor: "grey",
    totalWorthColor: "blue"
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const { defaultCurrency } = usePreferences();

  function onSave() {
    setLoading(true);
    patchRequest<IBalanceAnalysisSection>("/api/userSettings/update", { balanceAnalysis: state })
      .then((res) => {
        if (Object.hasOwn(res, "message")) {
          setMessageType("error");
          setMessage(res["message"]);
          return;
        }

        res.forecastPivotDate = new Date(res.forecastPivotDate);
        
        setState(res);
        setChanged(false);
        setMessage("");

        publish("cashBalanceChanged", null);
      })
      .catch((_) => {
        setMessageType("error");
        setMessage("Error saving user setting");
      })
      .finally(() => setLoading(false));
  }
  
  function onInputChange(value: string | number | Date | boolean, name: string) {
    if (changed === false) {
      setChanged(true);
    }

    setState({
      ...state,
      [name]: value,
    });
  }

  function onNumberInputChange(value: string, name: string) {
    onInputChange(!value ? 0 : parseInt(value) || state[name], name);
  }

  function handleClose() {
    props.onClose(false);

    setChanged(false);
    setMessage("");
  }

  const saveButton = (
    <Button type={changed ? "primary" : "default"} disabled={!changed || loading} onClick={onSave}>
      Save
    </Button>
  );

  useEffect(() => {
    if (props.open) {
      if (!loading) setLoading(true);

      getRequest<ReadUserSettingsResponse>("/api/userSettings/read", { balanceAnalysis: true }).then((res) => {
        res.balanceAnalysis.forecastPivotDate = new Date(res.balanceAnalysis.forecastPivotDate);

        setState(res.balanceAnalysis);
      }).finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, setState]);

  if (!props.open) return null;

  return (
    <Drawer loading={loading} open={props.open} onClose={handleClose} title="Balance analysis settings" size="small" extra={saveButton}>
      <div style={{ display: "flex", flexFlow: "column", gap: 16 }}>
        <Message colorType={messageType} counterMargin fadeIn messageStyle="bordered" onDismiss={() => setMessage("")}>
          {message}
        </Message>
        <h3>Main settings</h3>
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
            currency: defaultCurrency,
          }}
          onlyPositive
        />
        <Checkbox title="Hide investments data on load" value={toCheckState(state.hideInvestmentsOnLoad)} onChange={onInputChange} name="hideInvestmentsOnLoad" />
        <h3>Date range on load</h3>
        <Input required title="Default days before now" value={state.defaultDaysBeforeNow.toString()} name="defaultDaysBeforeNow" onChange={onNumberInputChange} />
        <Input required title="Default days after now" value={state.defaultDaysAfterNow.toString()} name="defaultDaysAfterNow" onChange={onNumberInputChange} />
        <h3>Chart colors</h3>
        <Select items={chartColorPreset} title="Investment dataset" menuAbove required value={state.investmentColor} onChange={onInputChange} name="investmentColor" />
        <Select items={chartColorPreset} title="Expectation dataset" menuAbove required value={state.predictionColor} onChange={onInputChange} name="predictionColor" />
        <Select items={chartColorPreset} title="Total worth dataset" menuAbove required value={state.totalWorthColor} onChange={onInputChange} name="totalWorthColor" />
      </div>
    </Drawer>
  );
}
