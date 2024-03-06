import { useRecoilState } from "recoil";
import { X } from "phosphor-react";

import { Card, Empty } from "@atoms/index";
import { ExpectationDetailsForm } from "@molecules/index";
import { selectedMonthExpectation } from "@recoil/expectations/atoms";
import WeeklyPredictionsChart from "./WeeklyPredictionsChart";

export default function ExpectationsBody() {
  const [expectation, setExpectation] = useRecoilState(selectedMonthExpectation);

  const date = expectation && new Date(expectation.period.from);
  const monthLabel = date?.toLocaleString("default", { month: "long" });

  return (
    <div className="expectationsBody">
      <Card
        noDivider
        header={{
          title: date ? `Editing ${date.getFullYear()} ${monthLabel}` : "Edit expectation",
        }}
        headerActions={expectation && [
          {
            type: "default",
            tooltip: "Close",
            icon: X,
            onClick: () => setExpectation(null)
          }
        ]}
      >
        {!expectation && <Empty />}
        {expectation && <ExpectationDetailsForm selectedExpectation={expectation} />}
      </Card>
      {expectation && (
        <Card noDivider header={{
          title: "Expectation visualization"
        }}>
          <WeeklyPredictionsChart prediction={expectation} />
        </Card>
      )}
    </div>
  );
}
