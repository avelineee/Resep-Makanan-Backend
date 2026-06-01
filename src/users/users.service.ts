import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException, } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    username: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findAll() {
  return this.prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}
async addFavorite(
  userId: number,
  recipeId: number,
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

  const existingFavorite =
    await this.prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

  if (existingFavorite) {
    throw new BadRequestException(
      'Recipe already added to favorites',
    );
  }

  return this.prisma.favorite.create({
    data: {
      userId,
      recipeId,
    },
  });
}
async getFavorites(userId: number) {
  return this.prisma.favorite.findMany({
    where: {
      userId,
    },

    include: {
      recipe: true,
    },
  });
}
  async removeFavorite(
    userId: number,
    recipeId: number,
  ) {
    return this.prisma.favorite.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
  }

  async getReviews(userId: number) {
    return this.prisma.review.findMany({
      where: { userId },
      include: { recipe: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(
  id: number,
  data: any,
) {

  const user =
    await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }

  return this.prisma.user.update({
    where: {
      id,
    },

    data: {
      ...(data?.username && {
        username: data.username,
      }),

      ...(data?.email && {
        email: data.email,
      }),

      ...(data?.profileImage && {
        profileImage:
          data.profileImage,
      }),

      ...(data?.role && {
        role: data.role,
      }),

      ...(typeof data?.isPremium ===
        'boolean' && {
        isPremium:
          data.isPremium,
      }),
    },

    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      profileImage: true,
      isPremium: true,
      createdAt: true,
    },
  });
}
}