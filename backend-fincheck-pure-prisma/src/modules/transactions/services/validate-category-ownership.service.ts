import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class ValidateTransactionOwnershipService {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(userId: string, transactionId: string) {
    const isOwner = await this.prismaService.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!isOwner) throw new NotFoundException('Transaction not Found!');

    return isOwner;
  }
}
