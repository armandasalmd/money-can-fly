import React from "react";
import { Story, Meta } from "@storybook/react";

import UploadArea, { UploadAreaProps } from "./UploadArea";

export default {
  title: "Atoms/UploadArea",
  component: UploadArea,
} as Meta;

const Template: Story<UploadAreaProps> = (args) => <UploadArea {...args} />;

export const Default = Template.bind({});
Default.args = {
  accept: ".csv",
  name: "file",
  multiple: false,
  onChange: (filesState: any) => console.log(filesState),
  maxFileSizeInMb: 5,
} as UploadAreaProps;
