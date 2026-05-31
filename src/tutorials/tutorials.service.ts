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

  async findOne(id: number) {

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

  const access =
    await this.prisma.userTutorialAccess
      .findFirst({
        where: {
          userId: user.id,

          tutorialId: tutorial.id,
        },
      });

  if (
    !access &&
    user?.role !== 'ADMIN'
  ) {
    throw new ForbiddenException(
      'You need to purchase this tutorial first',
    );
  }

  return tutorial;
}

  async update(id: number, data: any) {
    const tutorial = await this.prisma.tutorial.findUnique({ where: { id } });
    if (!tutorial) {
      throw new NotFoundException('Tutorial not found');
    }
    return this.prisma.tutorial.update({
      where: { id },
      data,
      include: { recipe: true },
    });
  }

  async remove(id: number) {
    const tutorial = await this.prisma.tutorial.findUnique({ where: { id } });
    if (!tutorial) {
      throw new NotFoundException('Tutorial not found');
    }
    return this.prisma.tutorial.delete({ where: { id } });
  }
}