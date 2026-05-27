import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.recipe.findMany();

    }
    async create(data: any) {
  return this.prisma.recipe.create({
    data,
  });
}
async update(id: number, data: any) {
  return this.prisma.recipe.update({
    where: {
      id,
    },

    data,
  });
}
async findOne(id: number) {
  return this.prisma.recipe.findUnique({
    where: {
      id,
    },
  });
}
async remove(id: number) {
  return this.prisma.recipe.delete({
    where: {
      id,
    },
  });
}
}
