import { useState, useEffect } from "react";

import { useDashboard } from "../../DashboardContext/useDashboard";
import { useTransaction } from "../../../../../app/hooks/useTransactions";
import { TransactionFilters } from "../../../../../app/services/transactionsService/getAll";
import { Transaction } from "../../../../../app/entities/Transaction";

export function useTransactionsController() {
  const { areValuesVisible } = useDashboard()

  const [isFilersModalOpen, setIsFilersModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [transactionBeingEdited, setTransactionBeingEdited] = useState<null | Transaction>(null)

  const [filters, setFilters] = useState<TransactionFilters>({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  })

  const {
    transactions,
    isLoading,
    isInitialLoading,
    refetchTransactions
  } = useTransaction(filters)

  useEffect(() => {
    refetchTransactions()
  }, [filters, refetchTransactions])

  function handleChangeFilters<TFilter extends keyof TransactionFilters>(filter: TFilter) {
    return (value: TransactionFilters[TFilter]) => {
      if (value === filters[filter]) return

      setFilters((prevState) => ({
        ...prevState,
        [filter]: value
      }))
    }
  }

  function handleApplyFilters({
    bankAccountId,
    year
  }: { bankAccountId: string | undefined, year: number }) {
    handleChangeFilters('bankAccountId')(bankAccountId)
    handleChangeFilters('year')(year)
    setIsFilersModalOpen(false)
  }

  function handleOpenFiltersModal() {
    setIsFilersModalOpen(true)
  }

  function handleCloseFiltersModal() {
    setIsFilersModalOpen(false)
  }

  function handleOpenEditTransactionModal(transaction: Transaction) {
    setIsEditModalOpen(true)
    setTransactionBeingEdited(transaction)
  }

  function handleCloseEditTransactionModal() {
    setIsEditModalOpen(false)
    setTransactionBeingEdited(null)
  }

  return {
    areValuesVisible,
    transactions,
    isInitialLoading,
    isLoading,
    isFilersModalOpen,
    handleOpenFiltersModal,
    handleCloseFiltersModal,
    handleChangeFilters,
    filters,
    handleApplyFilters,
    isEditModalOpen,
    transactionBeingEdited,
    handleOpenEditTransactionModal,
    handleCloseEditTransactionModal
  }
}
