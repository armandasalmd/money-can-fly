import React from "react";
import { Story, Meta } from "@storybook/react";

import TransactionSidebar, { TransactionSidebarProps } from "./TransactionSidebar";

export default {
  title: "Organisms/TransactionSidebar",
  component: TransactionSidebar,
} as Meta;

const Template: Story<TransactionSidebarProps> = (args) => <TransactionSidebar {...args} />;

export const Default = Template.bind({});
Default.args = {} as TransactionSidebarProps;
