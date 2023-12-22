import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { useCategories } from "../../../../../app/hooks/useCategories";
import { transactionsService } from "../../../../../app/services/transactionsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import { Transaction } from "../../../../../app/entities/Transaction";

const schema = z.object({
  value: z.union([
    z.string({ required_error: 'Informe o valor'}).nonempty('Informe o valor'),
    z.number()
  ]),
  name: z.string().nonempty('Informe o nome'),
  categoryId: z.string().nonempty('Informe a categoria'),
  bankAccountId: z.string().nonempty('Informe o banco'),
  date: z.date()
})

type FormData = z.infer<typeof schema>

export function useEditTransactionModalController(transaction: Transaction | null, onClose: () => void ) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankAccountId: transaction?.bankAccountId,
      categoryId: transaction?.categoryId,
      name: transaction?.name,
      date: transaction ? new Date(transaction.date) : new Date(),
      value: transaction?.value
    }
  })

  const {
    accounts
  } = useBankAccounts()

  const {
    categories: categoriesList
  } = useCategories()

  const categories = useMemo(() => {
    return categoriesList.filter((categories) => categories.type === transaction?.type)
  }, [categoriesList, transaction])

  const queryClient = useQueryClient()

  const {
    isLoading,
    mutateAsync: updateAsync
  } = useMutation(transactionsService.update)

  const {
    isLoading: isLoadingDelete,
    mutateAsync: removeAsync
  } = useMutation(transactionsService.remove)

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateAsync({
        ...data,
        id: transaction!.id,
        value: currencyStringToNumber(data.value),
        type: transaction!.type,
        date: data.date.toISOString(),
      })

      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })

      toast.success(
        transaction!.type === 'EXPENSE'
          ? 'Despesa editada com sucesso!'
          : 'Receita editada com sucesso!'
      )
      onClose()
    } catch {
      toast.error(
        transaction!.type === 'EXPENSE'
          ? 'Erro ao salvar despesa!'
          : 'Erro ao salvar receita!'
      )
    }
  })

  function handleOpenDeleteModal() {
    setIsDeleteModalOpen(true)
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false)
  }

  async function handleDeleteTransaction() {
    try {
      await removeAsync(transaction!.id)

      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })

      toast.success('A transação foi deletada com sucesso!')
      onClose()
    } catch {
      toast.error('Erro ao deletar transação!')
    }
  }

  return {
    register,
    control,
    errors,
    handleSubmit,
    accounts,
    categories,
    isLoading,
    isDeleteModalOpen,
    isLoadingDelete,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteTransaction
  }
}
