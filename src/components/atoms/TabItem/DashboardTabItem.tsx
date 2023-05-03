import { Button } from "@components/atoms";
import { callIfFunction } from "@utils/Global";
import { TabItemProps } from "./TabItemProps";

export default function DashboardTabItem(props: TabItemProps) {
  function onClick() {
    if (props.active === false) {
      callIfFunction(props.onClick, props.id);
    }
  }
  
  return (
    <Button small type={props.active ? "easy" : "text"} onClick={onClick} >
      {props.text}
    </Button>
  );
}