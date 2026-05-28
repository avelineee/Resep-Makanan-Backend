import {Injectable, NotFoundException,} from '@nestjs/common';
import { PrismaService }from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class TutorialsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: any) {

    const recipe =
      await this.prisma.recipe.findUnique({
        where: {
          id: data.recipeId,
        },
      });

    if (!recipe) {
      throw new NotFoundException(
        'Recipe not found',
      );
    }

    return this.prisma.tutorial.create({
      data,
    });
  }

  async findAll() {

    return this.prisma.tutorial.findMany({
      include: {
        recipe: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, user?: any) {

    const tutorial =
  await this.prisma.tutorial.findUnique({
    where: {
      id,
    },

    include: {
      recipe: true,
    },
  });

if (!tutorial) {
  throw new NotFoundException(
    'Tutorial not found',
  );
}

const transaction =
  await this.prisma.transaction.findFirst({
    where: {
      userId: user?.id,

      tutorialId: tutorial.id,

      status: 'SUCCESS',
    },
  });

if (
  tutorial.recipe.isPremium &&
  (!user || !transaction)
) {
  throw new ForbiddenException(
    'This tutorial is for premium users only',
  );
}

return tutorial;
  }

  async watchTutorial(
  id: number,
  user: any,
) {

  const tutorial =
    await this.prisma.tutorial.findUnique({
      where: {
        id,
      },

      include: {
        recipe: true,
      },
    });

  if (!tutorial) {
    throw new NotFoundException(
      'Tutorial not found',
    );
  }

  

  return tutorial;
}
}