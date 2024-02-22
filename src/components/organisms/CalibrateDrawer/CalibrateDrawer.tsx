import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { Button, Drawer, Message, MessageColor } from "@atoms/index";
import { CalibrateCurrencyTable, CalibrateFixOptions, CalibrateLatestInput, UpdateTargetCommand } from "@molecules/index";
import { Balances, CalibrateCurrencyRow, CalibrationStatus, DisplaySections, Money } from "@utils/Types";
import { AvailableFixesResponse } from "@endpoint/calibrate/availableFixes";
import { usePreferences } from "@context/index";
import { useDashboardData } from "@hooks/index";
import { balanceChartDateRange, spendingChartDateRanges } from "@recoil/dashboard/atoms";
import { publish } from "@utils/Events";
import { getRequest, postRequest } from "@utils/Api";
import { round } from "@server/utils/Global";

interface CalibrateDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function setRowStatus(row: CalibrateCurrencyRow) {
  if (!row.target.amount) {
    row.status = "unset";
  } else if (round(row.target.amount) === round(row.inApp.amount)) {
    row.status = "pass";
  } else {
    row.status = "fail";
  }
}

function toTableRows(balances: Balances, currentState: CalibrateCurrencyRow[]): CalibrateCurrencyRow[] {
  return Object.values(balances).map((currencyBalance) => {
    const currentTarget = currentState?.find((o) => o.target.currency === currencyBalance.currency)?.target;
    const result: CalibrateCurrencyRow = {
      inApp: currencyBalance,
      status: "unset",
      target: currentTarget || {
        amount: 0,
        currency: currencyBalance.currency,
      },
    };

    setRowStatus(result);

    return result;
  });
}

const messages: Record<CalibrationStatus, string> = {
  fail: "Resolve conflicts using actions below",
  pass: "All balances are calibrated",
  unset: "Set most recent values for each currency using input below",
};

const messageTypes: Record<CalibrationStatus, MessageColor> = {
  fail: "warning",
  pass: "success",
  unset: "info",
};

export default function CalibrateDrawer(props: CalibrateDrawerProps) {
  const { defaultCurrency } = usePreferences();
  const { mutate } = useDashboardData();
  const balanceAnalysisDateRange = useRecoilValue(balanceChartDateRange);
  const spendingChartRanges = useRecoilValue(spendingChartDateRanges);

  const [tableState, setTableState] = useState<CalibrateCurrencyRow[]>(null);
  const [mainStatus, setMainStatus] = useState<CalibrationStatus>("unset");
  const [availableFixes, setAvailableFixes] = useState<AvailableFixesResponse>(null);
  const [value, setValue] = useState<Money>({
    amount: 0,
    currency: defaultCurrency,
  });

  function onCommand(command: UpdateTargetCommand, money: Money) {
    const stateCopy = [...tableState];
    const row = stateCopy.find((o) => o.target.currency === money.currency);

    if (command === "set") {
      row.target.amount = money.amount;
    } else if (command === "add") {
      row.target.amount += money.amount;
    } else if (money.amount < row.target.amount) {
      row.target.amount -= money.amount;
    } else {
      row.target.amount = 0;
    }

    setRowStatus(row);
    setTableState(stateCopy);
  }

  function postFixApplied() {
    retrieveFixes();
    retreiveBalance();
  }

  function onTagClick(row: CalibrateCurrencyRow) {
    setValue({
      amount: value.amount,
      currency: row.target.currency,
    });
  }

  function onFinish() {
    mutate([DisplaySections.BalanceAnalysis, DisplaySections.Insights, DisplaySections.SpendingAnalysis], {
      balanceAnalysisDateRange,
      spendingChartRanges,
    });
    publish("searchFormSubmit", null);
    props.setOpen(false);
  }

  const retrieveFixes = useCallback(() => {
    function go() {
      postRequest("/api/calibrate/availableFixes", {
        targets: tableState,
      }).then(setAvailableFixes);
    }

    go();
  }, [tableState]);

  const retreiveBalance = useCallback(() => {
    getRequest<Balances>("/api/balance/read")
      .then(balances => {
        setTableState(
          toTableRows(balances, tableState).map((row) => {
            if (row.inApp.amount === 0) {
              row.status = "pass";
            }
            return row;
          })
        );
      });
  }, [tableState]);

  useEffect(() => {
    if (props.open) {
      retreiveBalance();
    } else {
      setTableState(null);
      setAvailableFixes(null);
      setValue({
        amount: 0,
        currency: defaultCurrency,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  useEffect(() => {
    const statuses = tableState?.map((o) => o.status) ?? ["unset"];

    if (statuses.includes("unset")) {
      setMainStatus("unset");
      setAvailableFixes(null);
    } else if (statuses.includes("fail")) {
      setMainStatus("fail");
      retrieveFixes();
    } else {
      setMainStatus("pass");
      setAvailableFixes(null);
    }
  }, [tableState, setMainStatus, setAvailableFixes, retrieveFixes]);

  return (
    <Drawer
      open={props.open}
      onClose={() => props.setOpen(false)}
      title="Calibrate cash balance"
      subtitle="Sync real-world balance to in-app balance"
      destroyOnClose
    >
      <div className="calibrateDrawer">
        <Message className="calibrateDrawer__message" colorType={messageTypes[mainStatus]} messageStyle="bordered">
          {messages[mainStatus]}
        </Message>
        <CalibrateLatestInput onCommand={onCommand} value={value} setValue={setValue} />
        <CalibrateCurrencyTable rows={tableState} onClick={onTagClick} />
        <CalibrateFixOptions postFixApplied={postFixApplied} fixes={availableFixes} />
        <div className="calibrateDrawer__footer">
          <Button centerText disabled={mainStatus !== "pass"} type="primary" onClick={onFinish}>
            Finish and close
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
