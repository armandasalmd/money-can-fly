import React, { ReactElement, PropsWithChildren, ReactNode } from "react";
import { ButtonProps, TabItemProps } from "@components/atoms";

type ReactTabItemProps = PropsWithChildren<TabItemProps>;

interface DashboardTabsProps {
  actionButtons?: ReactElement<ButtonProps>[];
  children: ReactElement<ReactTabItemProps>[];
  onTabChange?(id: string): void;
  tabId: string;
}

export default function DashboardTabs(props: DashboardTabsProps) {
  let activeContainer: ReactNode = null;

  const tabItemsWithClick: ReactElement[] = [];

  React.Children.forEach(props.children, (element) => {
    if (!React.isValidElement(element)) return;
    
    const tabProps: ReactTabItemProps = element.props;
    
    if (tabProps.id === props.tabId) {
      activeContainer = tabProps.children;
    }

    tabItemsWithClick.push(
      React.cloneElement(element, {
        onClick: props.onTabChange,
        key: tabProps.id,
        active: tabProps.id === props.tabId,
        ...tabProps,
      })
    );
  });

  return (
    <div className="dashboardTabs">
      <div className="dashboardTabs__heading">
        <div className="dashboardTabs__tabs">
          {tabItemsWithClick}
        </div>
        <div className="dashboardTabs__actions">{props.actionButtons}</div>
      </div>
      <div className="dashboardTabs__content">{activeContainer}</div>
    </div>
  );
}