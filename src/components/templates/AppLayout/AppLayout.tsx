import classNames from "classnames";
import { PropsWithChildren, Children, ReactElement, NamedExoticComponent } from "react";
import { Navbar } from "@molecules/index";
import SidebarHeader, { SidebarHeaderProps } from "@atoms/SidebarHeader/SidebarHeader";

interface AppLayoutProps extends PropsWithChildren {
  header?: SidebarHeaderProps;
}

const AppLayout = (props: AppLayoutProps) => {
  const subComponents = Object.keys(AppLayout).map((key) => {
    return Children.map(props.children, (child: ReactElement<PropsWithChildren, NamedExoticComponent>) => {
      return child.type.displayName === key ? child : null;
    });
  });
  
  const classes = classNames("app", {
    "app--noHeader": !props.header,
  });

  return (
    <div className={classes}>
      <Navbar className="app__navbar" />
      {props.header && <SidebarHeader {...props.header} className="app__sidebarHeader" />}
      {subComponents}
    </div>
  );
};

const Sidebar = (props: PropsWithChildren) => {
  return <div className="app__sidebar">{props.children}</div>;
};

const Content = (props: PropsWithChildren) => {
  return <div className="app__content">{props.children}</div>;
};

Sidebar.displayName = "Sidebar";
AppLayout.Sidebar = Sidebar;

Content.displayName = "Content";
AppLayout.Content = Content;

export default AppLayout;
