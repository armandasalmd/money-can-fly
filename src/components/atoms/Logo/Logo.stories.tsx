import React from "react";
import { Story, Meta } from "@storybook/react";

import Logo, { LogoProps } from "./Logo";
// import Constants from "@utils/Constants";

export default {
  title: "Example/Logo",
  component: Logo,
} as Meta;

const Template: Story<LogoProps> = (args) => <Logo {...args}>Hello world</Logo>;

export const Normal = Template.bind({});
Normal.args = {
  size: "M",
};

export const Clickable = Template.bind({});
Clickable.args = {
  onClick: () => alert("You clicked logo..."),
};
// Dark mode tutorial
// https://betterprogramming.pub/building-dark-mode-for-storybook-and-web-applications-99d3a0b76312#b506
