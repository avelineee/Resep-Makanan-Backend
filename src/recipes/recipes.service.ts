import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException, } from '@nestjs/common';

@Injectable()
export class RecipesService {
    constructor(private prisma: PrismaService) { }

    async findAll(
  search?: string,
  category?: string,
) {

  return this.prisma.recipe.findMany({
    where: {
      AND: [
        search
          ? {
              title: {
                contains: search,
              },
            }
          : {},

        category
          ? {
              category,
            }
          : {},
      ],
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
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
async createReview(
  userId: number,
  recipeId: number,
  data: any,
) {

  const recipe =
    await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

  if (!recipe) {
    throw new NotFoundException(
      'Recipe not found',
    );
  }

  const existingReview =
    await this.prisma.review.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

  if (existingReview) {
    throw new BadRequestException(
      'You have already reviewed this recipe',
    );
  }

  const review =
    await this.prisma.review.create({
      data: {
        userId,
        recipeId,
        ...data,
      },
    });

  const reviews =
    await this.prisma.review.findMany({
      where: {
        recipeId,
      },
    });

  const totalRating =
    reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

  const averageRating =
    totalRating / reviews.length;

  await this.prisma.recipe.update({
    where: {
      id: recipeId,
    },

    data: {
      rating: averageRating,
    },
  });

  return review;
}
async getReviews(recipeId: number) {

  const recipe =
    await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

  if (!recipe) {
    throw new NotFoundException(
      'Recipe not found',
    );
  }

  return this.prisma.review.findMany({
    where: {
      recipeId,
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
}
async deleteReview (
  userId: number,
  recipeId: number,
) {
  const review =
    await this.prisma.review.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

  if (!review) {
    throw new NotFoundException(
      'Review not found',
    );
  }

  await this.prisma.review.delete({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });

  const reviews =
    await this.prisma.review.findMany({
      where: {
        recipeId,
      },
    });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) =>
            sum + review.rating,
          0,
        ) / reviews.length
      : 0;

  await this.prisma.recipe.update({
    where: {
      id: recipeId,
    },

    data: {
      rating: averageRating,
    },
  });
}


}
