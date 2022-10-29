import React from "react";
import { Story, Meta } from "@storybook/react";

import CurrencyInput, { CurrencyInputProps } from "./CurrencyInput";

export default {
  title: "Molecules/CurrencyInput",
  component: CurrencyInput,
} as Meta;

const Template: Story<CurrencyInputProps> = (args) => <CurrencyInput {...args} />;

export const Default = Template.bind({});
Default.args = {};
