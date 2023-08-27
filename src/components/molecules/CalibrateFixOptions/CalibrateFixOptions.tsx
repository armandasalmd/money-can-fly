import { ArrowArcRight, TrendDown, TrendUp } from "phosphor-react";

import { Button, Header, PopConfirm, Tag } from "@atoms/index";
import { AvailableFixesResponse } from "@endpoint/calibrate/availableFixes";
import { amountForDisplay } from "@utils/Currency";
import { iconOptions } from "@utils/Global";
import { ExchangeFix, Money } from "@utils/Types";
import { ReactElement } from "react";

interface CalibrateFixOptionsProps {
  fixes: AvailableFixesResponse;
  postFixApplied(): void;
}

function ActionsPartial(fixes: ExchangeFix[] | Money[], title: string, buttonRenderFn: (data: ExchangeFix | Money, index: number) => ReactElement) {
  const isEmpty = !fixes || !fixes.length;

  return (
    <div className="calibrateFixOptions__group">
      <Header className="calibrateFixOptions__title" title={title} size="small" />
      {!isEmpty && <div className="calibrateFixOptions__options">{fixes.map(buttonRenderFn)}</div>}
      {isEmpty && (
        <div className="calibrateFixOptions__emptyTag">
          <Tag disabled>No fixes found</Tag>
        </div>
      )}
    </div>
  );
}

export default function CalibrateFixOptions(props: CalibrateFixOptionsProps) {
  if (!props.fixes) return null;

  async function applyTrendFix(money: Money) {
    const success = await fetch("/api/calibrate/applyTrendFix", {
      method: "POST",
      body: JSON.stringify(money),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((o) => o.json());

    if (success) props.postFixApplied();
  }

  async function applyExchangeFix(exchange: ExchangeFix) {
    const success = await fetch("/api/calibrate/applyExchangeFix", {
      method: "POST",
      body: JSON.stringify(exchange),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((o) => o.json());

    if (success) props.postFixApplied();
  }

  function TrendButton(money: Money, index: number) {
    return (
      <PopConfirm
        key={index}
        description="Balancing transaction will be created"
        onConfirm={() => applyTrendFix(money)}
        placement={index === 0 ? "bottomLeft" : "bottomCenter"}
      >
        <Button icon={money.amount < 0 ? TrendDown : TrendUp} type={money.amount < 0 ? "danger" : "easy"} key={money.currency} wrapContent>
          {amountForDisplay({
            amount: Math.abs(money.amount),
            currency: money.currency,
          })}
        </Button>
      </PopConfirm>
    );
  }

  function ExchangeButton(exchange: ExchangeFix, index: number) {
    return (
      <PopConfirm
        key={index}
        description="This cannot be undone. Your balance will be updated"
        onConfirm={() => applyExchangeFix(exchange)}
        placement={index === 0 ? "bottomLeft" : "bottomCenter"}
      >
        <Button wrapContent>
          {amountForDisplay(exchange.from)}{" "}
          <ArrowArcRight
            {...iconOptions}
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />{" "}
          {amountForDisplay(exchange.to)}
        </Button>
      </PopConfirm>
    );
  }

  return (
    <div className="calibrateFixOptions">
      {ActionsPartial(props.fixes?.exchangeFixes, "Currency exchange fixes", ExchangeButton)}
      {ActionsPartial(props.fixes?.trendFixes, "Trend transaction fixes", TrendButton)}
    </div>
  );
}
