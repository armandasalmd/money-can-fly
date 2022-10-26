import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import Input, { InputProps } from "./Input";
import { Airplane } from "phosphor-react";

export default {
  title: "Atoms/Input",
  component: Input,
} as Meta;

function InputWithState(props: InputProps) {
  const [value, setValue] = useState("");

  return <Input {...props} value={value} setValue={setValue} />;
}

const Template: Story<InputProps> = (args) => {
  args.fixedWidth = true;
  return <InputWithState {...args} />
}

export const Default = Template.bind({});
Default.args = {
  title: "Input title",
  icon: Airplane,
  placeholder: "Input placeholder",
} as InputProps;

export const DefaultWithoutIcon = Template.bind({});
DefaultWithoutIcon.args = {
  title: "Search description",
  placeholder: "Enter search term...",
} as InputProps;

export const DefaultError = Template.bind({});
DefaultError.args = {
  title: "Input title",
  icon: Airplane,
  placeholder: "Input placeholder",
  error: "Value is required",
  required: true,
} as InputProps;

export const RequiredPassword = Template.bind({});
RequiredPassword.args = {
  title: "Your password",
  icon: Airplane,
  placeholder: "Enter password...",
  required: true,
  password: true,
} as InputProps;

export const Disabled = Template.bind({});
Disabled.args = {
  title: "Input title",
  icon: Airplane,
  disabled: true
} as InputProps;

export const CustomStyle = Template.bind({});
CustomStyle.args = {
  title: "Input title",
  icon: Airplane,
  style: {
    background: "#d2d2d2",
  }
} as InputProps;