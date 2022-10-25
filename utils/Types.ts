import { RefAttributes, ForwardRefExoticComponent } from "react";
import { IconProps } from "phosphor-react";

export type IconComponentType = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;