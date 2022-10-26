import React from "react";
import { Story, Meta } from "@storybook/react";

import Header, { HeaderProps } from "./Header";

export default {
  title: "Atoms/Header",
  component: Header,
} as Meta;

const Template: Story<HeaderProps> = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Quick add transaction",
  color: "primary",
  size: "medium",
} as HeaderProps;

export const WithDescription = Template.bind({});
WithDescription.args = {
  title: "Actual spending by Category",
  description: "Statistics for 2022 October",
  color: "warning",
  size: "medium",
} as HeaderProps;
