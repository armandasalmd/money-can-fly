import React from "react";
import { Story, Meta } from "@storybook/react";

import Message, { MessageProps } from "./Message";

export default {
  title: "Atoms/Message",
  component: Message,
} as Meta;

const Template: Story<MessageProps> = (args) => <Message {...args} />;

export const CardStyle = Template.bind({});
CardStyle.args = {
  messageStyle: "card",
  colorType: "success",
  onDismiss: () => console.log("dismissed"),
  children: "This is a message. You are seeing card message style.",
} as MessageProps;

export const BorderedStyle = Template.bind({});
BorderedStyle.args = {
  messageStyle: "bordered",
  colorType: "success",
  onDismiss: () => console.log("dismissed"),
  children: "This is a message. You are seeing bordered message style.",
} as MessageProps;
