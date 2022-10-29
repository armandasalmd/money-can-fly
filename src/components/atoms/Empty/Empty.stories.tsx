import React from "react";
import { Story, Meta } from "@storybook/react";

import Empty, { EmptyProps } from "./Empty";

export default {
  title: "Atoms/Empty",
  component: Empty,
} as Meta;

const Template: Story<EmptyProps> = (args) => <Empty {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: "Custom empty text...",
} as EmptyProps;
