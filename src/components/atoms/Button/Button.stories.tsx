import React from "react";
import { Story, Meta } from "@storybook/react";

import Button, { ButtonProps } from "./Button";

export default {
  title: "Atoms/Button",
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <div style={{display: "flex"}}><Button {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  children: "Default button",
  type: "default",
  wrapContent: true,
} as ButtonProps;

export const Primary = Template.bind({});
Primary.args = {
  children: "Primary button",
  type: "primary",
  wrapContent: true,
} as ButtonProps;

export const Easy = Template.bind({});
Easy.args = {
  children: "Easy button",
  type: "easy",
  wrapContent: true,
} as ButtonProps;

export const Danger = Template.bind({});
Danger.args = {
  children: "Danger button",
  type: "danger",
  wrapContent: true,
} as ButtonProps;

export const Text = Template.bind({});
Text.args = {
  children: "Text button",
  type: "text",
  wrapContent: true,
} as ButtonProps;

export const Transparent = Template.bind({});
Transparent.args = {
  children: "Transparent button",
  type: "transparent",
  wrapContent: true,
} as ButtonProps;
