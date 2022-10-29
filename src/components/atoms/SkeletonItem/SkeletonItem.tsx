import classNames from "classnames";

type SkeletonTemplate = "transaction" | "import";

export interface SkeletonItemProps {
  template: SkeletonTemplate;
  height?: number;
  borderBottom?: boolean;
  borderTop?: boolean;
}

export default function SkeletonItem(props: SkeletonItemProps) {
  const classes = classNames("skeletonItem", {
    [`skeletonItem--${props.template}`]: props.template,
    "skeletonItem--borderBottom": props.borderBottom,
    "skeletonItem--borderTop": props.borderTop,
  });

  return <div className={classes} style={{height: props.height}}>
    {props.template === "transaction" && <div className="skeletonItem__left" />}
    <span className="skeletonItem__main">
      <div id="first" />
      <div id="second" />
    </span>
    <div className="skeletonItem__right" />
  </div>;
}
