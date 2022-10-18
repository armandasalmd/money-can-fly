import Image from "next/image";
import classNames from "classnames";
import Constants from "@utils/Constants";

interface LogoProps {
  noText?: boolean;
  noTextSmallScreen?: boolean;
  size?: "S" | "M" | "L";
  onClick?(): void;
}

export default function Logo(props: LogoProps) {

  const classes = classNames("logo", {
    "logo--noText": props.noText,
    "logo--noTextSmallScreen": props.noTextSmallScreen,
    "logo--selectable": props.onClick !== undefined
  });

  let imgSize = 40;
  let fontSize = 20;
  
  if (props.size === "S") {
    imgSize = 32;
    fontSize = 16;
  } else if (props.size === "L") {
    imgSize = 54;
    fontSize = 28;
  }

  return (
    <div className={classes} onClick={props.onClick}>
      <Image width={imgSize} height={imgSize} src="/images/logo.svg" alt="logo" />
      <p className="logo__text" style={{fontSize: fontSize}}>{Constants.appName}</p>
    </div>
  );
}