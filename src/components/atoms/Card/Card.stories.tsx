import React from "react";
import { Story, Meta } from "@storybook/react";

import Card, { CardProps } from "./Card"

export default {
  title: "Atoms/Card",
  component: Card,
} as Meta;

const Template: Story<CardProps> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  header: {
    title: "Actual spending by Category",
    description: "Statistics for the last 30 days",
    color: "warning",
  },
  children: <div>This is card content placeholder</div>,
} as CardProps;

export const WithError = Template.bind({});
WithError.args = {
  header: {
    title: "Actual spending by Category",
    description: "Statistics for the last 30 days",
    color: "warning",
  },
  children: <div>This is card content placeholder</div>,
  error: "This is card error placeholder",
} as CardProps;

export const HeaderActions = Template.bind({});
HeaderActions.args = {
  header: {
    title: "Actual spending by Category",
    description: "Statistics for the last 30 days",
    color: "warning",
  },
  children: <div>This is card content placeholder</div>,
  headerActions: [
    {
      text: "Edit categories",
      type: "easy",
      onClick: () => alert("Edit categories"),
    }
  ]
} as CardProps;

export const Loading = Template.bind({});
Loading.args = {
  header: {
    title: "Actual spending by Category",
    description: "Statistics for the last 30 days",
    color: "warning",
  },
  children: <div>This is card content placeholder</div>,
  loading: true,
  loadingText: "Please wait while we save your changes",
} as CardProps;