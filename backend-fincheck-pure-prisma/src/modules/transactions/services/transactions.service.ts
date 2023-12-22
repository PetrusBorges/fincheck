import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { ValidateBankAccountsOwnershipService } from '../../bank-accounts/services/validate-bank-accounts-ownership.service';
import { ValidateCategoryOwnershipService } from '../../categories/services/validate-category-ownership.service';
import { ValidateTransactionOwnershipService } from './validate-category-ownership.service';
import { TransactionType } from '../entities/Transaction';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validateBankAccountsOwnership: ValidateBankAccountsOwnershipService,
    private readonly validateCategoryOwnership: ValidateCategoryOwnershipService,
    private readonly validateTransactionOwnership: ValidateTransactionOwnershipService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId, name, date, type, value } =
      createTransactionDto;

    await this.validateEntitiesOwnership({ userId, categoryId, bankAccountId });

    return this.prismaService.transaction.create({
      data: {
        userId,
        categoryId,
        bankAccountId,
        name,
        date,
        type,
        value,
      },
    });
  }

  findAll(
    userId: string,
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ) {
    return this.prismaService.transaction.findMany({
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

    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionId,
    });

    return this.prismaService.transaction.update({
      where: { id: transactionId },
      data: {
        categoryId,
        bankAccountId,
        name,
        date,
        type,
        value,
      },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateEntitiesOwnership({ userId, transactionId });

    await this.prismaService.transaction.delete({
      where: { id: transactionId },
    });

    return null;
  }

  private async validateEntitiesOwnership({
    userId,
    categoryId,
    bankAccountId,
    transactionId,
  }: {
    userId: string;
    categoryId?: string;
    bankAccountId?: string;
    transactionId?: string;
  }) {
    await Promise.all([
      transactionId &&
        this.validateTransactionOwnership.validate(userId, transactionId),
      bankAccountId &&
        this.validateBankAccountsOwnership.validate(userId, bankAccountId),
      categoryId && this.validateCategoryOwnership.validate(userId, categoryId),
    ]);
  }
}
