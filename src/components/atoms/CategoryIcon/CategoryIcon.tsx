import { createElement } from "react";
import classNames from "classnames";

import { Size, Category } from "@utils/Types";
import AllCategories from "./TransactionCategories";

export interface CategoryIconProps {
  category: Category;
  size: Size;
}

type SizeValues = {
  [key in Size]: number;
}

const sizes: SizeValues = {
  large: 40,
  medium: 32,
  small: 24,
};

export default function CategoryIcon(props: CategoryIconProps) {
  const classes = classNames("categoryIcon", {});
  const categoryMeta = AllCategories[props.category || "other"];
  const hexTransparency = "40"; // 25% transparency

  return (
    <div className={classes} style={{backgroundColor: categoryMeta.color + hexTransparency}}>
      {createElement(categoryMeta.icon, {
        className: "categoryIcon__icon",
        color: categoryMeta.color,
        weight: "duotone",
        size: sizes[props.size || "medium"],
      })}
    </div>
  );
}
