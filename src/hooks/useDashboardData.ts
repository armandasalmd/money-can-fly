import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";

import { dashboardData } from "@recoil/dashboard/atoms";
import { DisplaySections } from "@utils/Types";
import { DisplayModelResponse } from "@endpoint/dashboard/displayModel";
import { getOneMonthRange } from "@utils/Date";

function transformDates(data: Partial<DisplayModelResponse>) {
  if (!data) return;

  const investments = data?.investments?.investments;

  if (investments) {
    investments.forEach((item) => item.dateModified = new Date(item.dateModified));
  }

  const insights = data?.insights;

  if (insights) {
    insights.budgetResetDate = new Date(insights.budgetResetDate);
  }
}

let initialized = false;

export default function useDashboardData<T>(section?: DisplaySections) {
  const [data, setData] = useRecoilState(dashboardData);

  const fetchSections = useCallback(
    async (sections: DisplaySections[] = [], body: object = {}) => {
      try {
        if (section !== undefined && !sections.includes(section)) {
          sections.push(section);
        }

        const response = await fetch("/api/dashboard/displayModel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...body,
            sections,
          }),
        });

        const result: Partial<DisplayModelResponse> = await response.json();

        transformDates(result);

        setData({
          ...data,
          ...result,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [section, data, setData],
  );

  useEffect(() => {
    if (!initialized && data === null && section !== undefined) {
      // eslint-disable-next-line
      initialized = true;

      const thisMonthRange = getOneMonthRange();

      fetchSections(Object.values(DisplaySections), {
        categoryAnalysisDateRange: thisMonthRange,
        spendingChartRanges: [
          getOneMonthRange(undefined, -2),
          getOneMonthRange(undefined, -1),
          thisMonthRange
        ],
      });
    }

    return () => {
      // Settimeout somehow prevents the hook from being called twice
      // As this endpoint is expensive, its worth using this hack
      setTimeout(() => {
        initialized = false;
      });
    };
  }, [data, fetchSections, section]);

  return {
    data: (section === undefined || !data ? null : data[section]) as T,
    mutate: fetchSections,
  };
}
