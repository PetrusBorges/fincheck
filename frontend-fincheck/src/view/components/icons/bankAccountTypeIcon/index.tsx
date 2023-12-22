import { iconstMap } from "./iconMap"

interface BankAccountTypeIconProps {
  type: keyof typeof iconstMap
}

export function BankAccountTypeIcon({ type }: BankAccountTypeIconProps) {
  const Icon = iconstMap[type]

  return <Icon />
}
