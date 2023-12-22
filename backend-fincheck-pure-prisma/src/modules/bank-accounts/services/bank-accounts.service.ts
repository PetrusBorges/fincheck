import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { ValidateBankAccountsOwnershipService } from './validate-bank-accounts-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validateBankAccountsOwnership: ValidateBankAccountsOwnershipService,
  ) {}

  async create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { name, initialBalance, type, color } = createBankAccountDto;

    return await this.prismaService.bankAccount.create({
      data: {
        userId,
        name,
        initialBalance,
        type,
        color,
      },
    });
  }

  async findAll(userId: string) {
    const bankAccounts = await this.prismaService.bankAccount.findMany({
      where: { userId },
      include: {
        transactions: {
          select: {
            type: true,
            value: true,
          },
        },
      },
    });

    return bankAccounts.map((bankAccount) => {
      const totalTransactions = bankAccount.transactions.reduce(
        (acc, transaction) =>
          acc +
          (transaction.type === 'INCOME'
            ? transaction.value
            : -transaction.value),
        0,
      );

      const currentBalance = bankAccount.initialBalance + totalTransactions;

      return {
        ...bankAccount,
        currentBalance,
      };
    });
  }

  async findOne(userId: string, bankAccountId: string) {
    return await this.validateBankAccountsOwnership.validate(
      userId,
      bankAccountId,
    );
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { name, initialBalance, type, color } = updateBankAccountDto;

    await this.validateBankAccountsOwnership.validate(userId, bankAccountId);

    return await this.prismaService.bankAccount.update({
      where: { id: bankAccountId },
      data: {
        name,
        initialBalance,
        type,
        color,
      },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBankAccountsOwnership.validate(userId, bankAccountId);

    await this.prismaService.bankAccount.delete({
      where: { id: bankAccountId },
    });

    return null;
  }
}
