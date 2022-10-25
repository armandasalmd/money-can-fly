import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Logo from "../../components/atoms/Logo/Logo";
import Constants from "../../utils/Constants";

export default {
  title: "Example/Logo",
  component: Logo,
  argTypes: undefined,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args}>{Constants.appName}</Logo>;

export const Normal = Template.bind({});
Normal.args = {
  size: "M"
};

export const Clickable = Template.bind({});
Clickable.args = {
  onClick: () => alert("You clicked logo...")
};
// Dark mode tutorial
// https://betterprogramming.pub/building-dark-mode-for-storybook-and-web-applications-99d3a0b76312#b506