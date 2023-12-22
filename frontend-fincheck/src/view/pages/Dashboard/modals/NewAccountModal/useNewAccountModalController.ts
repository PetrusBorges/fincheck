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
  initialBalance: z.string({required_error: 'Saldo inicial é obrigatório'}).nonempty('Saldo inicial é obrigatório'),
  type: z.enum(['CHECKING', 'INVESTMENT', 'CASH']),
  color: z.string().nonempty('Cor é obrigatório')
})

type FormData = z.infer<typeof schema>

export function useNewAccountModalController() {
  const {
    isNewAccountModalOpen,
    closeNewAccountModal
  } = useDashboard()

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const queryClient = useQueryClient()

  const { isLoading, mutateAsync } = useMutation(bankAccountsService.create)

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance)
      })

      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })

      toast.success('Conta foi cadastrada com sucesso!')
      closeNewAccountModal()
      reset()
    } catch {
      toast.error('Erro ao cadastrar a conta!')
    }
  })

  return {
    isNewAccountModalOpen,
    closeNewAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isLoading
  }
}
