import classNames from "classnames";
import format from "date-fns/format";

import { amountForDisplay } from "@utils/Currency";
import { Money, MonthPrediction, Category } from "@utils/Types";
import { CategoryIcon } from "@atoms/index";

export interface PredictionPreviewListProps {
  prediction: MonthPrediction;
  isSelected: boolean;
  onClick: (period: MonthPrediction) => void;
}

export default function PredictionPreviewList(props: PredictionPreviewListProps) {
  const { prediction, isSelected, onClick } = props;
  const money: Money = {
     currency: prediction.currency,
     amount: prediction.totalChange || 0
  };
  const classes = classNames("predictionList__item", {
    "predictionList__item--selected": isSelected
  });

  const iconCategory: Category = prediction.totalChange >= 0 ? "trendUp" : "trendDown";

  return (
    <div
      className={classes}
      onClick={() => onClick(prediction)}
    >
      <div className="predictionList__itemIcon">
        <CategoryIcon category={iconCategory} size="small" />
      </div>
      <div className="predictionList__itemTitle">
        {format(prediction.period.from, "yyyy MMMM")}
      </div>
      <div className="predictionList__itemSubtitle">
        Total change {amountForDisplay(money)}
      </div>
    </div>
  );
}