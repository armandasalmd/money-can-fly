import { useResetRecoilState } from "recoil";
import { useEffect } from "react";

import { AppLayout, TransactionsBody } from "@templates/index";
import { pagedTransactionsState, filterFormState, selectedTransactionsState } from "@recoil/transactions/atoms";

export default function TransactionsPage() {
  const resetFilters = useResetRecoilState(filterFormState);
  const resetTransactions = useResetRecoilState(pagedTransactionsState);
  const resetSelected = useResetRecoilState(selectedTransactionsState);

  useEffect(() => {
    return () => {
      resetFilters();
      resetTransactions();
      resetSelected();
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
