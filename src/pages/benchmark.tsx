import { useEffect, useState } from "react";

import { Button, Header, Insight, Input } from "@atoms/index";
import { usePreferences } from "@context/PreferencesContext";
import { DisplayModelRequest } from "./api/dashboard/displayModel";
import { getUTCNow, dateFromNow } from "@utils/Date";
import { DateRange, DisplaySections } from "@utils/Types";
import { round } from "@server/utils/Global";

interface BenchmarkCaseProps {
  body: DisplayModelRequest;
  attempts: number;
  title: string;
  captureResult(latency: number, size: number): void;
}

function BenchmarkCase(props: BenchmarkCaseProps) {
  const [attempt, setAttempt] = useState(0);
  const [total, setTotal] = useState(0);
  const [sizeKb, setSizeKb] = useState(0);
  const [running, setRunning] = useState(false);

  async function run() {
    setTotal(0);
    setAttempt(0);
    setSizeKb(0);
    setRunning(true);

    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.body),
    };

    for (let i = 0; i < props.attempts; i++) {
      let timeFrom = new Date().getTime();
      let response = await fetch("/api/dashboard/displayModel", requestOptions);

      setAttempt((val) => val + 1);

      if (!response.ok) {
        setTotal(-1);
        break;
      }

      let msTime = new Date().getTime() - timeFrom;
      setTotal((total) => (total * i + msTime) / (i + 1));

      if (i === props.attempts - 1) {
        setSizeKb(round((await response.blob()).size / 1024));
      }
    }

    setRunning(false);
  }
  
  useEffect(() => {
    if (sizeKb > 0) {
      props.captureResult(total, sizeKb);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeKb]);

  return (
    <div style={{ width: 400 }}>
      <Insight title={props.title} color={attempt === props.attempts ? "success" : "warning"} subtitle={`Attempt: ${attempt}/${props.attempts}`}>
        <p>
          Avg time: <strong>{total} ms</strong>
        </p>
        <p>
          Response size: <strong>{sizeKb} kb</strong>
        </p>
        <Button style={{ marginTop: 16 }} disabled={running} wrapContent type="primary" onClick={run}>
          Run test
        </Button>
      </Insight>
    </div>
  );
}

const sections = [DisplaySections.BalanceAnalysis, DisplaySections.CategoryAnalysis, DisplaySections.Insights, DisplaySections.Investments];
const monthDateRange: Required<DateRange> = {
  from: dateFromNow(-30),
  to: getUTCNow(),
};
const monthCase: DisplayModelRequest = {
  balanceAnalysisDateRange: monthDateRange,
  categoryAnalysisDateRange: monthDateRange,
  sections,
  spendingChartRanges: [],
};
const monthCaseBalanceSection: DisplayModelRequest = {
  balanceAnalysisDateRange: monthDateRange,
  categoryAnalysisDateRange: monthDateRange,
  sections: [DisplaySections.BalanceAnalysis],
  spendingChartRanges: [],
};
const futureDateRange: Required<DateRange> = {
  from: dateFromNow(30),
  to: getUTCNow(60),
};
const futureCase: DisplayModelRequest = {
  balanceAnalysisDateRange: futureDateRange,
  categoryAnalysisDateRange: futureDateRange,
  sections,
  spendingChartRanges: [],
};
const futureCaseBalanceSection: DisplayModelRequest = {
  balanceAnalysisDateRange: futureDateRange,
  categoryAnalysisDateRange: futureDateRange,
  sections: [DisplaySections.BalanceAnalysis],
  spendingChartRanges: [],
};
const yearDateRange: Required<DateRange> = {
  from: dateFromNow(-365),
  to: getUTCNow(),
};
const yearCase: DisplayModelRequest = {
  balanceAnalysisDateRange: yearDateRange,
  categoryAnalysisDateRange: yearDateRange,
  sections,
  spendingChartRanges: [],
};
const monthYearAgoDateRange: Required<DateRange> = {
  from: dateFromNow(-395),
  to: getUTCNow(-365),
};
const monthYearAgoCase: DisplayModelRequest = {
  balanceAnalysisDateRange: monthYearAgoDateRange,
  categoryAnalysisDateRange: monthYearAgoDateRange,
  sections,
  spendingChartRanges: [],
};
const monthYearAgoOnlyBalanceCase: DisplayModelRequest = {
  balanceAnalysisDateRange: monthYearAgoDateRange,
  categoryAnalysisDateRange: monthYearAgoDateRange,
  sections: [DisplaySections.BalanceAnalysis],
  spendingChartRanges: [],
};
const pastThreeYearsDateRange: Required<DateRange> = {
  from: dateFromNow(-365 * 3),
  to: getUTCNow(),
};
const pastThreeYearsCase: DisplayModelRequest = {
  balanceAnalysisDateRange: pastThreeYearsDateRange,
  categoryAnalysisDateRange: pastThreeYearsDateRange,
  sections,
  spendingChartRanges: [],
};

export default function BenchmarkPage() {
  let { setSuspend } = usePreferences();
  let [attempts, setAttempts] = useState("5");
  let [sizes, setSizes] = useState<number[]>([]);
  let [latencies, setLatencies] = useState<number[]>([]);

  useEffect(() => {
    setSuspend(true);
    return () => setSuspend(false);
  });

  const attemptsInt = parseInt(attempts) || 5;

  if (process.env.NODE_ENV === "production") {
    return <p>This page is disabled in Production</p>;
  }

  function captureResult(latency: number, size: number) {
    // console.log(latency,size);
    setSizes([...sizes, size]);
    setLatencies([...latencies, latency]);
  }

  function clearRunsAverage() {
    setSizes([]);
    setLatencies([]);
  }

  return (
    <div style={{ margin: 16 }}>
      <Header title="Dashboard benchmarks" />
      <br />
      <Input value={attempts} setValue={setAttempts} fixedWidth title="Run attempts per case" />
      <br />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <BenchmarkCase attempts={attemptsInt} body={futureCaseBalanceSection} title="Future range + only balance" captureResult={captureResult} />
        <BenchmarkCase attempts={attemptsInt} body={monthCaseBalanceSection} title="Last month + only balance" captureResult={captureResult} />
        <BenchmarkCase attempts={attemptsInt} body={monthYearAgoOnlyBalanceCase} title="Month year ago + only balance" captureResult={captureResult} />
        <BenchmarkCase attempts={attemptsInt} body={futureCase} title="Future range + all sections" captureResult={captureResult} />
        <BenchmarkCase attempts={attemptsInt} body={monthCase} title="Last month + all sections" captureResult={captureResult} />
        <BenchmarkCase attempts={attemptsInt} body={monthYearAgoCase} title="Month year ago + all sections" captureResult={captureResult} />
        <BenchmarkCase attempts={attemptsInt} body={yearCase} title="Last year + all sections" captureResult={captureResult} />
        <BenchmarkCase attempts={attemptsInt} body={pastThreeYearsCase} title="HEAVY: 3 years range + all sections" captureResult={captureResult} />
        <div style={{ width: 400 }}>
          <Insight title="Cummulative average" color="info">
            <p>
              Avg time: <strong>{latencies.length ? round(latencies.reduce((acc, item) => acc + item, 0) / latencies.length) : 0} ms</strong>
            </p>
            <p>
              Avg size: <strong>{sizes.length ? round(sizes.reduce((acc, item) => acc + item, 0) / sizes.length) : 0} kb</strong>
            </p>
            <Button style={{ marginTop: 16 }} wrapContent type="default" onClick={clearRunsAverage}>
              Clear
            </Button>
          </Insight>
        </div>
      </div>
    </div>
  );
}
