import { useEffect, useState } from "react";

import { Drawer, Message, MessageColor, TabItem } from "@atoms/index";
import { Tabs } from "@molecules/index";
import { AddTimelineEvent, InvestmentTimeline } from "@organisms/index";
import { CreateInvestmentEvent, Investment, InvestmentSummary } from "@utils/Types";
import { publish } from "@utils/Events";
import { getRequest, postRequest } from "@utils/Api";

interface InvestmentDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedInvestment: InvestmentSummary | null
}

export default function InvestmentDetailsDrawer(props: InvestmentDetailsDrawerProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageColor>("success");
  const [activeTabId, setActiveTabId] = useState("timeline");
  const [investment, setInvestment] = useState<Investment>(null);

  useEffect(() => {
    if (props.selectedInvestment?.id) {
      getRequest<Investment>(`/api/investments/read`, {
        investmentId: props.selectedInvestment.id
      }).then(investment => {
        investment.dateCreated = new Date(investment.dateCreated);
        
        for (let event of investment.timelineEvents) {
          event.eventDate = new Date(event.eventDate);
        }

        setInvestment(investment);
      });
    }
  }, [props.selectedInvestment]);

  if (!investment) return null;

  function displayMessage(message: string, messageType: MessageColor) {
    setMessage(message);
    setMessageType(messageType);
  }

  function onClose() {
    setMessage(null);
    setActiveTabId("timeline");
    setInvestment(null);
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
    <Drawer loading={!investment} size="small" open={props.open} onClose={onClose} title="Inspect & manage investment" subtitle={investment.title} noPadding destroyOnClose>
      {message && (
        <Message colorType={messageType} onDismiss={() => setMessage(null)} fadeIn messageStyle="bordered">
          {message}
        </Message>
      )}
      <Tabs tabId={activeTabId} onTabChange={onTabChange} spaceEvenly>
        <TabItem id="timeline" text="Timeline">
          <InvestmentTimeline displayMessage={displayMessage} investment={investment} setInvestment={setInvestment} />
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
