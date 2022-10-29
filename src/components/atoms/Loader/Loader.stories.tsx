import React from "react";
import { Story, Meta } from "@storybook/react";

import Loader, { LoaderProps } from "./Loader";

export default {
  title: "Atoms/Loader",
  component: Loader,
} as Meta;

const Template: Story<LoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {
  color: "primary",
  hasMarginY: false,
  text: "Custom loading text...",
} as LoaderProps;
