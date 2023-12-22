import { useState } from 'react';
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { useDashboard } from "../../DashboardContext/useDashboard";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankAccountsService } from '../../../../../app/services/bankAccountsService';
import { currencyStringToNumber } from '../../../../../app/utils/currencyStringToNumber';

const schema = z.object({
  name: z.string().nonempty('Nome da conta é obrigatório'),
  initialBalance: z.union([
    z.string({required_error: 'Saldo inicial é obrigatório'}).nonempty('Saldo inicial é obrigatório'),
    z.number()
  ]),
  type: z.enum(['CHECKING', 'INVESTMENT', 'CASH']),
  color: z.string().nonempty('Cor é obrigatório')
})

type FormData = z.infer<typeof schema>

export function useEditAccountModalController() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  const {
    isEditAccountMondal,
    closeEditAccountModal,
    accountBeingEdit
  } = useDashboard()

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      initialBalance: accountBeingEdit?.initialBalance,
      color: accountBeingEdit?.color,
      type: accountBeingEdit?.type,
      name: accountBeingEdit?.name
    }
  })

  const queryClient = useQueryClient()

  const {
    isLoading,
    mutateAsync: updateAsync
  } = useMutation(bankAccountsService.update)

  const {
    isLoading: isLoadingDelete,
    mutateAsync: removeAsync
  } = useMutation(bankAccountsService.remove)

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateAsync({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
        id: accountBeingEdit!.id
      })

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })

      toast.success('A conta foi editada com sucesso!')
      closeEditAccountModal()
    } catch {
      toast.error('Erro ao deletar a conta!')
    }
  })

  function handleOpenDeleteModal() {
    setIsDeleteModalVisible(true)
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalVisible(false)
  }

  async function handleDeleteAccount() {
    try {
      await removeAsync(accountBeingEdit!.id)

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })

      toast.success('A conta foi deletada com sucesso!')
      closeEditAccountModal()
    } catch {
      toast.error('Erro ao deletar as alterações!')
    }
  }

  return {
    isEditAccountMondal,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isLoading,
    isDeleteModalVisible,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteAccount,
    isLoadingDelete
  }
}
