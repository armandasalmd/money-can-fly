import { Info as InfoIcon } from "phosphor-react";
import { iconOptions } from "@utils/Global";
import { PropsWithChildren } from "react";

export default function Info(props: PropsWithChildren) {
  return (
    <div className="info">
      <InfoIcon className="info__icon" {...iconOptions} />
      <span>{props.children}</span>
    </div>
  );
}
