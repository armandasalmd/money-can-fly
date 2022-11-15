import React, { useState } from "react";
import { Bookmark } from "phosphor-react";
import { Story, Meta } from "@storybook/react";

import Drawer, { DrawerProps } from "./Drawer";
import { Button, Input, Select } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { categotyPreset } from "@utils/SelectItems";

export default {
  title: "Atoms/Drawer",
  component: Drawer,
} as Meta;

function DrawerWithState(props: DrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button wrapContent type="primary" onClick={() => setOpen(!open)}>Open Drawer</Button>
      <Drawer
        {...props}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
          <Input title="Description" required />
          <Input title="Bank name" required value="Barclays" />
          <CurrencyInput title="Amount" required value={{
            amount: 12.23,
            currency: "GBP"
          }} onChange={() => {}} />
          <Select
            name="category"
            items={categotyPreset}
            title="Category"
            icon={Bookmark}
            required
            onChange={() => {}}
          />
        </div>
      </Drawer>
    </div>
  );
}

const Template: Story<DrawerProps> = (args) => <DrawerWithState {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Create new transaction",
  subtitle: "Drawer subtitle",
  size: "default",
  extra: <Button type="easy">Create</Button>,
} as DrawerProps;

export const Large = Template.bind({});
Large.args = {
  title: "Large drawer title",
  size: "large",
  extra: <Button type="easy">Extra button</Button>,
} as DrawerProps;