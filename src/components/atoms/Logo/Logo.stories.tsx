import React from "react";
import { Story, Meta } from "@storybook/react";

import Logo, { LogoProps } from "./Logo";
import Constants from "@utils/Constants";

export default {
  title: "Atoms/Logo",
  component: Logo,
} as Meta;

const Template: Story<LogoProps> = (args) => <Logo {...args}>{Constants.appName}</Logo>;

export const Default = Template.bind({});
Default.args = {
  size: "M",
};
