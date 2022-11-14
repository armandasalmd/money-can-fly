import React, { useState, useEffect } from "react";
import { Story, Meta } from "@storybook/react";

import Pagination, { PaginationProps } from "./Pagination";

export default {
  title: "Molecules/Pagination",
  component: Pagination,
} as Meta;

function PaginationWithState(props: PaginationProps) {
  const [page, setPage] = useState(2);

  useEffect(() => {
    console.log("Page changed to", page);
  }, [page]);

  return <Pagination {...props} jump={setPage} />;
}

const Template: Story<PaginationProps> = (args) => <PaginationWithState {...args} />;

export const Default = Template.bind({});
Default.args = {
  currentPage: 1,
  maxPage: 10,
} as PaginationProps;
