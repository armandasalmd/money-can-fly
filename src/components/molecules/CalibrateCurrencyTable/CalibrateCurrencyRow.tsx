import { createElement } from "react";
import { CircleDashed, CheckCircle, XCircle } from "phosphor-react";
import { CalibrationStatus, CalibrateCurrencyRow } from "@utils/Types";

import { KeyValue, Tag, TagType } from "@atoms/index";
import { amountForDisplay } from "@utils/Currency";

interface ComponentProps {
  data: CalibrateCurrencyRow;
  onClick?(currency: CalibrateCurrencyRow): void;
}

const iconDict: Record<CalibrationStatus, any> = {
  unset: CircleDashed,
  pass: CheckCircle,
  fail: XCircle,
};

const colorDict: Record<CalibrationStatus, string> = {
  unset: "var(--shade30)",
  pass: "var(--color-success)",
  fail: "var(--color-error)",
};

const StatusIcon = (status: CalibrationStatus) =>
  createElement(iconDict[status], {
    size: 28,
    color: colorDict[status],
    weight: "duotone",
  });

export default function Component(props: ComponentProps) {
  const { data } = props;
  const diff = data.target.amount - data.inApp.amount;

  let tagType: TagType = "default";
  let tagText = "Set target";

  if (data.status === "pass") {
    tagText = "Calibrated";
  } else if (data.status === "fail") {
    tagText = amountForDisplay({
      amount: Math.abs(diff),
      currency: data.target.currency
    });

    if (diff > 0) {
      tagType = "easy";
    } else if (diff < 0) {
      tagType = "negative";
    }
  }

  return (
    <div className="calibrateTable__row">
      <span className="calibrateTable__cell">{StatusIcon(data.status)}</span>
      <span className="calibrateTable__cell">
        <KeyValue title="Target" value={amountForDisplay(data.target)} />
      </span>
      <span className="calibrateTable__cell">
        <KeyValue title="In-app" value={amountForDisplay(data.inApp)} />
      </span>
      <span className="calibrateTable__cell calibrateTable__cell--titledTag">
        <p className="calibrateTable__tagTitle">Difference</p>
        <Tag type={tagType} onClick={o => props?.onClick(o)} clickMetaData={data}>{tagText}</Tag>
      </span>
    </div>
  );
}
