import { httpClient } from "../httpClient";
import { Category } from "../../entities/Category";

export async function getAll() {
  const { data } = await httpClient.get<Category[]>('categories')

  return data
}
