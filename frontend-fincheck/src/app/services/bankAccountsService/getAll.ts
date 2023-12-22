import { httpClient } from "../httpClient";
import { BankAccount } from "../../entities/BankAccount";

export async function getAll() {
  const { data } = await httpClient.get<BankAccount[]>('bank-accounts')

  return data
}
