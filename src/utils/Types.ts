import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "phosphor-react";

export type IconComponentType = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;
