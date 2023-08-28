import { useState } from "react";
import { useRecoilValue } from "recoil";

import { Drawer, Message, MessageColor, TabItem } from "@atoms/index";
import { Tabs } from "@molecules/index";
import { AddTimelineEvent, InvestmentTimeline } from "@organisms/index";
import { selectedInvestment } from "@recoil/dashboard/atoms";
import { CreateInvestmentEvent } from "@utils/Types";
import { publish } from "@utils/Events";
import { postRequest } from "@utils/Api";

interface InvestmentDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function InvestmentDetailsDrawer(props: InvestmentDetailsDrawerProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageColor>("success");
  const investment = useRecoilValue(selectedInvestment);
  const [activeTabId, setActiveTabId] = useState("timeline");

  if (!investment) return null;

  function displayMessage(message: string, messageType: MessageColor) {
    setMessage(message);
    setMessageType(messageType);
  }

  function onClose() {
    setMessage(null);
    setActiveTabId("timeline");
    props.onClose();
  }

  function onCreateEvent(data: CreateInvestmentEvent) {
    postRequest<any>("/api/investments/addEvent", {
      investmentId: investment.id,
      ...data,
    })
      .then((data) => {
        if (data && data.success === true) {
          displayMessage("Event created successfully", "success");

          publish("investmentsMutated", null);

          setActiveTabId("timeline");
        } else {
          displayMessage(data.message || "Error creating event", "error");
        }
      })
      .catch((err) => {
        displayMessage("Error creating event", "error");
      });
  }

  function onTabChange(id: string) {
    setMessage(null);
    setActiveTabId(id);
  }

  return (
    <Drawer size="small" open={props.open} onClose={onClose} title="Inspect & manage investment" subtitle={investment.title} noPadding destroyOnClose>
      {message && (
        <Message colorType={messageType} onDismiss={() => setMessage(null)} fadeIn messageStyle="bordered">
          {message}
        </Message>
      )}
      <Tabs tabId={activeTabId} onTabChange={onTabChange} spaceEvenly>
        <TabItem id="timeline" text="Timeline">
          <InvestmentTimeline displayMessage={displayMessage} />
        </TabItem>
        <TabItem id="deposit" text="Deposit">
          <AddTimelineEvent currentInvestmentValue={investment.currentValue} eventType="deposit" onCreateEvent={onCreateEvent} />
        </TabItem>
        <TabItem id="adjust" text="Adjust">
          <AddTimelineEvent currentInvestmentValue={investment.currentValue} eventType="adjustment" onCreateEvent={onCreateEvent} />
        </TabItem>
        <TabItem id="withdraw" text="Withdraw">
          <AddTimelineEvent currentInvestmentValue={investment.currentValue} eventType="withdrawal" onCreateEvent={onCreateEvent} />
        </TabItem>
      </Tabs>
    </Drawer>
  );
}
