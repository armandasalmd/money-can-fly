import React from "react";
import { Story, Meta } from "@storybook/react";

import SkeletonItem, { SkeletonItemProps } from "./SkeletonItem";

export default {
  title: "Atoms/SkeletonItem",
  component: SkeletonItem,
} as Meta;

const Template: Story<SkeletonItemProps> = (args) => <SkeletonItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  template: "transaction",
  borderBottom: true,
  borderTop: true
} as SkeletonItemProps;
