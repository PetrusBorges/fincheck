import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "../services/transactionsService";
import { TransactionFilters } from "../services/transactionsService/getAll";

export function useTransaction(filters: TransactionFilters) {
  const { data, isFetching, isInitialLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsService.getAll(filters)
  })

  return {
    transactions: data ?? [],
    isLoading: isFetching,
    isInitialLoading,
    refetchTransactions: refetch
  }
}
