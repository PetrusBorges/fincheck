import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userId: string) {
    return await this.prismaService.category.findMany({
      where: {
        userId,
      },
    });
  }
}
