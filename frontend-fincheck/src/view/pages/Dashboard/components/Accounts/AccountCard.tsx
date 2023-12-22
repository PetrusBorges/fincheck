import { BankAccountTypeIcon } from "../../../../components/icons/bankAccountTypeIcon";

import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import { cn } from "../../../../../app/utils/cn";
import { useDashboard } from "../../DashboardContext/useDashboard";
import { BankAccount } from "../../../../../app/entities/BankAccount";

interface AccountCardProps {
  data: BankAccount;
}

export function AccountCard({ data }: AccountCardProps) {
  const { color, name, currentBalance, type } = data;

  const {
    areValuesVisible,
    openEditAccountModal
  } = useDashboard()

  return (
    <div
      className="p-4 bg-white rounded-2xl h-[208px] flex flex-col justify-between border-b-4 border-teal-950"
      style={{ borderColor: color }}
      role="button"
      onClick={() => openEditAccountModal(data)}
    >
      <div>
        <BankAccountTypeIcon type={type} />

        <span className="text-gray-800 font-medium trancking-[-0.5px] mt-4 block">
          {name}
        </span>
      </div>

      <div>
        <span
          className={cn(
            "text-gray-800 font-medium trancking-[-0.5px] block",
            areValuesVisible && 'blur-sm'
          )}
        >
          {formatCurrency(currentBalance)}
        </span>
        <small className="text-gray-600 text-sm">Saldo atual</small>
      </div>
    </div>
  )
}
