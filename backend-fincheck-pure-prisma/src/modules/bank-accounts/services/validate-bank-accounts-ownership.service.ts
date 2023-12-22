import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class ValidateBankAccountsOwnershipService {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(userId: string, bankAccountId: string) {
    const isOwner = await this.prismaService.bankAccount.findFirst({
      where: {
        id: bankAccountId,
        userId,
      },
    });

    if (!isOwner) throw new NotFoundException('BankAccount not Found!');

    return isOwner;
  }
}
