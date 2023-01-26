import { useRecoilState } from "recoil";

import { dashboardData } from "@recoil/dashboard/atoms";
import { DisplaySections, InvestmentEvent } from "@utils/Types";
import { useEffect } from "react";
import { DisplayModelResponse } from "@endpoint/dashboard/displayModel";

function transformDates(data: Partial<DisplayModelResponse>) {
  if (!data) return;

  const investments = data?.investments?.investments;

  if (investments) {
    investments.forEach((item) => {
      item.dateCreated = new Date(item.dateCreated);
      item.dateModified = new Date(item.dateModified);
      item.timelineEvents.forEach((event: InvestmentEvent) => {
        event.eventDate = new Date(event.eventDate);
      })
    });
  }

  const insights = data?.insights;

  if (insights) {
    insights.budgetResetDate = new Date(insights.budgetResetDate);
  }
}

let initialized = false;

export default function useDashboardData<T>(section: DisplaySections) {
  const [data, setData] = useRecoilState(dashboardData);

  async function fetchSections(sections: DisplaySections[] = [], body: object = {}) {
    try {
      const response = await fetch("/api/dashboard/displayModel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          sections: [...sections, section],
        }),
      });
  
      const result: Partial<DisplayModelResponse> = await response.json();
      
      transformDates(result);

      setData({
        ...data,
        ...result
      });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!initialized && data === null) {
      // eslint-disable-next-line
      initialized = true;

      // Initial fetch of all sections
      fetchSections(Object.values(DisplaySections));
    }
  }, []);

  return {
    data: (data?.[section] ?? null) as T,
    mutate: fetchSections,
  };
}