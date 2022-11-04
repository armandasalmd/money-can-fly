import { Borrowing } from "@utils/Types";
import BorrowItem from "./BorrowItem";
import { Empty } from "@atoms/index";

export interface BorrowListProps {
  borrows: Borrowing[];
}

export default function BorrowList(props: BorrowListProps) {
  return (
    <div className="borrowList">
      {props.borrows.map((Borrow) => (
        <BorrowItem key={Borrow.id} {...Borrow} />
      ))}
      {props.borrows.length === 0 && <Empty />}
    </div>
  );
}
