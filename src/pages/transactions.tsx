import { useResetRecoilState } from "recoil";
import { useEffect } from "react";

import { AppLayout, TransactionsBody } from "@templates/index";
import { pagedTransactionsState, filterFormState } from "@recoil/transactions/atoms";

export default function TransactionsPage() {
  const resetFilters = useResetRecoilState(filterFormState);
  const resetTransactions = useResetRecoilState(pagedTransactionsState);

  useEffect(() => {
    return () => {
      resetFilters();
      resetTransactions();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <AppLayout.Content>
        <TransactionsBody />
      </AppLayout.Content>
    </AppLayout>
  );
}
