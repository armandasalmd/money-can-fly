import { createElement } from "react";

import { Size, Category } from "@utils/Types";
import AllCategories from "./CategoryIconMetaData";

export interface CategoryIconProps {
  category: Category;
  size: Size;
}

const sizes: Record<Size, number> = {
  large: 40,
  medium: 32,
  small: 24,
};

export default function CategoryIcon(props: CategoryIconProps) {
  const categoryMeta = AllCategories[props.category || "other"];
  const hexTransparency = "40"; // 25% transparency

  return (
    <div className="categoryIcon" title={categoryMeta.label} style={{backgroundColor: categoryMeta.color + hexTransparency}}>
      {createElement(categoryMeta.icon, {
        className: "categoryIcon__icon",
        color: categoryMeta.color,
        weight: "duotone",
        size: sizes[props.size || "medium"],
      })}
    </div>
  );
}
