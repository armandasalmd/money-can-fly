import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import CurrencyInput, { CurrencyInputProps } from "./CurrencyInput";
import { Money, Currency } from "@utils/Types";

export default {
  title: "Molecules/CurrencyInput",
  component: CurrencyInput,
} as Meta;

function CurrencyInputWithState(props: CurrencyInputProps) {
  const [value, setValue] = useState<Money>({ amount: 0, currency: "GBP" });

  return (
    <CurrencyInput fixedWidth {...props} value={value} onChange={setValue} />
  );
}

const Template: Story<CurrencyInputProps> = (args) => (
  <CurrencyInputWithState {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: "Currency Input",
  error: "Cannot be empty",
} as CurrencyInputProps;
