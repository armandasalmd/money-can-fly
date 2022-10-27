import React from "react";
import { Story, Meta } from "@storybook/react";
import { Cake } from "phosphor-react";

import Select, { SelectProps } from "./Select";

export default {
  title: "Atoms/Select",
  component: Select,
} as Meta;

const selectItems = [
  { label: "Item 1", value: "item1" },
  { label: "Item 2", value: "item2" },
  { label: "Item 3", value: "item3" },
  { label: "Item 4", value: "item4" },
  { label: "Item 5", value: "item5" },
  { label: "Item 6", value: "item6" },
  { label: "Item 7", value: "item7" },
  { label: "Item 8", value: "item8" },
  { label: "Item 9", value: "item9" },
  { label: "Item 10", value: "item10" },
];

function SelectWithState(props: SelectProps) {
  const [value, setValue] = React.useState<string>(props.value);

  return <Select {...props} value={value} onChange={setValue} />;
}

const Template: Story<SelectProps> = (args) => <SelectWithState {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: selectItems,
  title: "Select your favorite item",
  icon: Cake,
  value: "item2",
  fixedWidth: true,
} as SelectProps;

export const NotSelected = Template.bind({});
NotSelected.args = {
  items: selectItems,
  title: "Select your favorite item",
  icon: Cake,
  required: false,
  fixedWidth: true,
} as SelectProps;

