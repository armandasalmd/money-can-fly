import classNames from "classnames";
import Button, { ButtonProps } from "@atoms/Button/Button";

export interface SidebarHeaderProps {
  actionButton?: ButtonProps;
  className?: string;
  subtitle: string;
  title: string;
}

export default function SidebarHeader(props: SidebarHeaderProps) {
  return (
    <div className={classNames("sidebarHeader", props.className)}>
      <div className="sidebarHeader__titles">
        <h1 className="sidebarHeader__title">{props.title}</h1>
        <p className="sidebarHeader__subtitle">{props.subtitle}</p>
      </div>
      {props.actionButton && <Button className="sidebarHeader__action" {...props.actionButton} />}
    </div>
  );
}
