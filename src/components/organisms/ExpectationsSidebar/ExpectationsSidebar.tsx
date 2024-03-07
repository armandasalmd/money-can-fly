import { useState } from "react";

import { Loader, TabItem } from "@atoms/index";
import { Tabs } from "@molecules/index";
import YearList from "./YearList";

export default function ExpectationsSidebar() {
  const yearNow = new Date().getFullYear();
  
  const [activeTabId, setActiveTabId] = useState(yearNow.toString());
  const [loading, setLoading] = useState(true);

  const availableYears = [yearNow - 2, yearNow - 1, yearNow, yearNow + 1, yearNow + 2];
  const tabItems = availableYears.map((year) => (
    <TabItem key={year} id={year.toString()} text={year.toString()}>
      <YearList year={year} setLoading={setLoading} />
    </TabItem>
  ));

  function onTabChange(tabId: string) {
    setLoading(true);
    setActiveTabId(tabId);
  }

  return (
    <div className="expectationsSidebar">
      <Tabs tabId={activeTabId} onTabChange={onTabChange} noPadding>
        {tabItems}
      </Tabs>
      {loading && <Loader className="expectationsSidebar__loader" color="secondary" /> }
    </div>
  );
}
