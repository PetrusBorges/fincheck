import { useState, useMemo } from "react"

import { useWindowWidth } from "../../../../../app/hooks/useWindowWidth"
import { useDashboard } from "../../DashboardContext/useDashboard"
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts"

export function useAccountsController() {
  const [sliderState, setSliderState] = useState({
    isBeginning: true,
    isEnd: false,
  })

  const {
    areValuesVisible,
    toggleValuesVisibility,
    openNewAccountModal,
  } = useDashboard()

  const {
    accounts,
    isFetching
  } = useBankAccounts()

  const currentBalance = useMemo(() => {
    return accounts.reduce((total, account) => total + account.currentBalance, 0)
  }, [accounts])

  const windowWidth = useWindowWidth()

  return {
    sliderState,
    setSliderState,
    windowWidth,
    areValuesVisible,
    toggleValuesVisibility,
    isLoading: isFetching,
    accounts,
    openNewAccountModal,
    currentBalance
  }
}
