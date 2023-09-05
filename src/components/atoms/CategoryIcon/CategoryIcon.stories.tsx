import React from "react";
import { Story, Meta } from "@storybook/react";

import CategoryIcon, { CategoryIconProps } from "./CategoryIcon";

export default {
  title: "Atoms/CategoryIcon",
  component: CategoryIcon,
} as Meta;

const Template: Story<CategoryIconProps> = (args) => <CategoryIcon {...args} />;

export const Default = Template.bind({});
Default.args = {
  category: "alcoholSmoking",
  size: "medium",
} as CategoryIconProps;
