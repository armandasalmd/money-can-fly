import React, { ReactElement, PropsWithChildren, ReactNode } from "react";
import classNames from "classnames";
import { TabItemProps } from "@atoms/index";

type ReactTabItemProps = PropsWithChildren<TabItemProps>;

interface TabsProps {
  children: ReactElement<ReactTabItemProps>[];
  spaceEvenly?: boolean;
  noPadding?: boolean;
  onTabChange?(id: string): void;
  tabId: string;
}

export default function Tabs(props: TabsProps) {
  const classes = classNames("tabs", {
    "tabs--spaceEvenly": props.spaceEvenly,
    "tabs--noPadding": props.noPadding
  });

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
        active: props.tabId === tabProps.id,
        ...tabProps,
      })
    );
  });

  return (
    <div className={classes}>
      <div className="tabs__heading">{tabItemsWithClick}</div>
      <div className="tabs__content">{activeContainer}</div>
    </div>
  );
}
