import classNames from "classnames";
import Button, { ButtonProps } from "@atoms/Button/Button";

export interface SidebarHeaderProps {
  actionButtons?: ButtonProps[];
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
      <div className="sidebarHeader__actions">
        {props.actionButtons && props.actionButtons.map((o, index) => <Button className="sidebarHeader__action" key={index} {...o} />)}
      </div>
    </div>
  );
}
