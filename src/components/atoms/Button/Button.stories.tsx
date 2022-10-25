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
  children: "Primary",
  type: "primary",
  wrapContent: true,
} as ButtonProps;
