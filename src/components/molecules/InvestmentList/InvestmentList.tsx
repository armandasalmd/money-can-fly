import { InvestmentSummary } from "@utils/Types";
import { InvestmentListItem } from "./InvestmentListItem";
import { Empty } from "@atoms/index";

interface InvestmentListProps {
  investments: InvestmentSummary[];
  onClick: (investment: InvestmentSummary) => void;
}

export default function InvestmentList(props: InvestmentListProps) {
  const { investments, onClick } = props;

  if (investments.length === 0) {
    return <Empty text="No investments yet" />;
  }

  return (
    <div className="investmentList">
      {investments.map((investment) => (
        <InvestmentListItem
          key={investment.id}
          investment={investment}
          onClick={onClick}
        />
      ))}
    </div>
  );
}