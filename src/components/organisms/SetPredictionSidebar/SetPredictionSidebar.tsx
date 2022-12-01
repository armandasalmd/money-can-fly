import { useState, useRef, useEffect } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { ChartBar, NoteBlank } from "phosphor-react";

import { Button, Message, MessageColor } from "@atoms/index";
import { CreateUpdatePredictionForm } from "@components/molecules";
import { MonthPrediction } from "@utils/Types";
import { SetPeriodRequest } from "@endpoint/predictions/setPeriod";
import { monthPredictionFormState, editorChartToolState } from "@recoil/predictions/atoms";
import { publish } from "@utils/Events";

export default function SetPredictionSidebar() {
  const thisRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState<MessageColor>("info");

  const resetFormState = useResetRecoilState(monthPredictionFormState);
  const formState = useRecoilValue(monthPredictionFormState);
  const [editorChartTool, setEditorChartTool] = useRecoilState(editorChartToolState);
  const previewEnabled = editorChartTool !== null;

  function generalError() {
    setMessage("Something went wrong. Please try again.");
    setMessageColor("error");
  }

  function scrollTop() {
    if (thisRef.current) {
      setTimeout(() => thisRef.current.scrollIntoView());
    }
  }

  function onFormSubmit(prediction: MonthPrediction, isEmpty: boolean) {
    if (isEmpty) {
      setMessage("Please fill in at least one week.");
      setMessageColor("warning");
      scrollTop();
      return;
    }

    const request: SetPeriodRequest = {
      currency: prediction.currency,
      predictions: prediction.predictions,
      periodMonth: prediction.period.from.toISOString(),
    };

    setSaving(true);

    fetch("/api/predictions/setPeriod", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((o) => o.json())
      .then((data) => {
        if (data.success) {
          setMessage("Prediction set sucessfully.");
          setMessageColor("success");
          publish("predictionsUpdated", data.data);
          setEditorChartTool(null);
          resetFormState();
        } else {
          generalError();
        }
      })
      .catch(generalError)
      .finally(() => {
        setSaving(false);
        scrollTop();
      });
  }

  function togglePreview() {
    setEditorChartTool(previewEnabled ? null : formState);
  }

  useEffect(() => {
    if (editorChartTool !== null) {
      setEditorChartTool(formState);
    }
  }, [editorChartTool, setEditorChartTool, formState]);

  return (
    <div className="setPrediction" ref={thisRef}>
      <div className="setPrediction__container">
        <Message colorType={messageColor} messageStyle="bordered" onDismiss={() => setMessage("")} fadeIn>
          {message}
        </Message>
        <div className="setPrediction__tools">
          <Button
            wrapContent
            type={previewEnabled ? "easy" : "default"}
            icon={ChartBar}
            onClick={togglePreview}
          >{`Chart tool ${previewEnabled ? "on" : "off"}`}</Button>
          <Button icon={NoteBlank} wrapContent onClick={resetFormState}>
            Clear form
          </Button>
        </div>
        <CreateUpdatePredictionForm loading={saving} onSubmit={onFormSubmit} />
      </div>
    </div>
  );
}
