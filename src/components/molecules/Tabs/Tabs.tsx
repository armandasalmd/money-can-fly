import React, { ReactElement, PropsWithChildren, ReactNode } from "react";
import classNames from "classnames";
import { TabItemProps } from "@components/atoms";

type ReactTabItemProps = PropsWithChildren<TabItemProps>;

interface TabContainerProps {
  id: string;
  container: ReactNode;
}

interface TabsProps {
  children: ReactElement<ReactTabItemProps>[];
  spaceEvenly?: boolean;
  onTabChange?(id: string): void;
  tabId: string;
}

export default function Tabs(props: TabsProps) {
  const classes = classNames("tabs", {
    "tabs--spaceEvenly": props.spaceEvenly,
  });

  const tabContainers: TabContainerProps[] = [];

  const tabItemsWithClick: ReactElement[] = [];

  React.Children.forEach(props.children, (element) => {
    if (!React.isValidElement(element)) return;

    const tabProps: ReactTabItemProps = element.props;

    tabContainers.push({
      id: tabProps.id,
      container: tabProps.children,
    });

    tabItemsWithClick.push(
      React.cloneElement(element, {
        onClick: props.onTabChange,
        key: tabProps.id,
        active: props.tabId === tabProps.id,
        ...tabProps,
      })
    );
  });

  let activeContainer: ReactNode = tabContainers.find(function (tab: TabContainerProps) {
    return tab.id === props.tabId;
  })?.container;

  return (
    <div className={classes}>
      <div className="tabs__heading">{tabItemsWithClick}</div>
      <div className="tabs__content">{activeContainer}</div>
    </div>
  );
}
