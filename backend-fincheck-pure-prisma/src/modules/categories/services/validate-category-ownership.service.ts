import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class ValidateCategoryOwnershipService {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(userId: string, categoryId: string) {
    const isOwner = await this.prismaService.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!isOwner) throw new NotFoundException('Category not Found!');

    return isOwner;
  }
}
