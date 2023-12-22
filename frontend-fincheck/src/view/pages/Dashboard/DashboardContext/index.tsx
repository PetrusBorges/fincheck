import { createContext, useCallback, useState } from "react";
import { BankAccount } from "../../../../app/entities/BankAccount";

interface DashboardContextValue {
  areValuesVisible: boolean;
  toggleValuesVisibility(): void;
  isNewAccountModalOpen: boolean;
  openNewAccountModal(): void;
  closeNewAccountModal(): void;
  isNewTransactionModalOpen: boolean;
  openNewTransactionModal(type: 'INCOME' | 'EXPENSE'): void;
  closeNewTransactionModal(): void;
  newTransactionType: 'INCOME' | 'EXPENSE' | null;
  isEditAccountMondal: boolean;
  accountBeingEdit: BankAccount | null;
  openEditAccountModal(bankAccount: BankAccount): void;
  closeEditAccountModal(): void;
}

export const DashboardContext = createContext({} as DashboardContextValue)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [areValuesVisible, setAreValuesVisible] = useState(false)
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false)
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)
  const [newTransactionType, setNewTransactionType] = useState<'INCOME' | 'EXPENSE' | null>(null)
  const [isEditAccountMondal, setIsEditAccountMondal] = useState(false)
  const [accountBeingEdit, setAccountBeingEdit] = useState<BankAccount | null>(null)

  const toggleValuesVisibility = useCallback(() => {
    setAreValuesVisible((prevState) => !prevState)
  }, [])

  const openNewAccountModal = useCallback(() => {
    setIsNewAccountModalOpen(true)
  }, [])

  const closeNewAccountModal = useCallback(() => {
    setIsNewAccountModalOpen(false)
  }, [])

  const openNewTransactionModal = useCallback((type: 'INCOME' | 'EXPENSE') => {
    setNewTransactionType(type)
    setIsNewTransactionModalOpen(true)
  }, [])

  const closeNewTransactionModal = useCallback(() => {
    setNewTransactionType(null)
    setIsNewTransactionModalOpen(false)
  }, [])

  const openEditAccountModal = useCallback((bankAccount: BankAccount) => {
    setAccountBeingEdit(bankAccount)
    setIsEditAccountMondal(true)
  }, [])

  const closeEditAccountModal = useCallback(() => {
    setAccountBeingEdit(null)
    setIsEditAccountMondal(false)
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        areValuesVisible,
        toggleValuesVisibility,
        isNewAccountModalOpen,
        openNewAccountModal,
        closeNewAccountModal,
        isNewTransactionModalOpen,
        openNewTransactionModal,
        closeNewTransactionModal,
        newTransactionType,
        isEditAccountMondal,
        accountBeingEdit,
        openEditAccountModal,
        closeEditAccountModal
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
