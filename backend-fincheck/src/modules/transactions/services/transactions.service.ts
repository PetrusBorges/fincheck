import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateBankAccountOwnership } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnership } from 'src/modules/categories/services/validate-category-ownership.service';
import { ValidateTransactionOwnership } from './validate-transaction-ownership.service';
import { TransactionType } from '../entities/Transaction';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateBankAccountOwnership: ValidateBankAccountOwnership,
    private readonly validadeCategoryOwnership: ValidateCategoryOwnership,
    private readonly validateTransactionOwnership: ValidateTransactionOwnership,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId, name, date, type, value } =
      createTransactionDto;

    await this.validateBankAccountOwnership.validate(userId, bankAccountId);

    await this.validadeCategoryOwnership.validate(userId, categoryId);

    return this.transactionsRepo.create({
      data: {
        userId,
        bankAccountId,
        categoryId,
        name,
        date,
        type,
        value,
      },
    });
  }

  findAllByUserId(
    userId: string,
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ) {
    return this.transactionsRepo.findMany({
      where: {
        userId,
        bankAccountId: filters.bankAccountId,
        type: filters.type,
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month)),
          lt: new Date(Date.UTC(filters.year, filters.month + 1)),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });
  }

  async update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { bankAccountId, categoryId, name, date, type, value } =
      updateTransactionDto;

    await this.validateTransactionOwnership.validate(userId, transactionId);
    await this.validateBankAccountOwnership.validate(userId, bankAccountId);

    await this.validadeCategoryOwnership.validate(userId, categoryId);

    return this.transactionsRepo.update({
      where: { id: transactionId },
      data: {
        bankAccountId,
        categoryId,
        name,
        date,
        type,
        value,
      },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateTransactionOwnership.validate(userId, transactionId);

    await this.transactionsRepo.delete({
      where: { id: transactionId },
    });

    return null;
  }
}
