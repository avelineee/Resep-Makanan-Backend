import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException, } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ForbiddenException } from '@nestjs/common';


@Injectable()
export class RecipesService {
  constructor(
    private prisma: PrismaService,

    private cloudinaryService:
      CloudinaryService,
  ) { }

  async findAll(
    search?: string,
    category?: string,
    page = 1,
    limit = 10,
    status?: string,
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

          status === 'ALL'
            ? {}
            : { status: (status as any) || 'APPROVED' }
        ],
      },

      include: {
        ingredientItems: true,

        stepItems: true,

        tags: true,

        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },

        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async create(data: any) {

    return this.prisma.recipe.create({
      data: {
        title: data.title,

        description: data.description,

        imageUrl: data.imageUrl,

        category: data.category,

        prepTime: data.prepTime,

        cookTime: data.cookTime,

        servings: data.servings,

        calories: data.calories,

        status: data.status || 'PENDING',

        ...(data.tags && {
          tags: {
            create: data.tags.map(
              (tag: string) => ({
                name: tag,
              }),
            ),
          },
        }),

        ingredients: JSON.stringify(
          data.ingredients,
        ),

        steps: JSON.stringify(
          data.steps,
        ),

        ...(data.categoryIds?.length && {
          categories: {
            create: data.categoryIds.map(
              (categoryId: number) => ({
                categoryId,
              }),
            ),
          },
        }),

        ingredientItems: {
          create: data.ingredients || [],
        },

        stepItems: {
          create: (data.steps || []).map(
            (step: any) => ({
              stepNumber: step.stepNumber,
              description: step.description,
            }),
          ),
        },
      },

      include: {
        ingredientItems: true,

        stepItems: true,

        tags: true,
      },
    });
  }

  async update(id: number, data: any) {

    const recipe =
      await this.prisma.recipe.findUnique({
        where: {
          id,
        },
      });

    if (!recipe) {
      throw new NotFoundException(
        'Recipe not found',
      );
    }


    return this.prisma.recipe.update({
      where: {
        id,
      },

      data: {
        ...(data.title !== undefined && {
          title: data.title,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.imageUrl !== undefined && {
          imageUrl: data.imageUrl,
        }),

        ...(data.category !== undefined && {
          category: data.category,
        }),

        ...(data.prepTime !== undefined && {
          prepTime: data.prepTime,
        }),

        ...(data.cookTime !== undefined && {
          cookTime: data.cookTime,
        }),

        ...(data.servings !== undefined && {
          servings: Number(data.servings),
        }),

        ...(data.calories !== undefined && {
          calories: Number(data.calories),
        }),

        ...(data.ingredients !== undefined && {
          ingredients: JSON.stringify(data.ingredients),
        }),

        ...(data.steps !== undefined && {
          steps: JSON.stringify(data.steps),
        }),

        ...(Array.isArray(data.ingredients) && {
          ingredientItems: {
            deleteMany: {},

            create: data.ingredients,
          },
        }),

        ...(Array.isArray(data.steps) && {
          stepItems: {
            deleteMany: {},

            create: data.steps.map(
              (step: any) => ({
                stepNumber:
                  step.stepNumber,

                description:
                  step.description,
              }),
            ),
          },
        }),

        ...(data.tags && {
          tags: {
            deleteMany: {},
            create: data.tags.map(
              (tag: string) => ({
                name: tag,
              }),
            ),
          },
        }),
      },

      include: {
        ingredientItems: true,

        stepItems: true,

        tags: true,
      },
    });
  }

  async verifyRecipe(id: number, status: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('Recipe not found');
    return this.prisma.recipe.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async findOne(id: number, user?: any) {

    const recipe =
      await this.prisma.recipe.findUnique({
        where: {
          id,
        },

        include: {
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },

            orderBy: {
              createdAt: 'desc',
            },
          },

          ingredientItems: true,

          stepItems: true,

          tags: true,

          author: { select: { username: true } },

          categories: {
            include: {
              category: true,


            },
          },

          _count: {
            select: {
              favorites: true,
              reviews: true,
            },
          },
        },
      });

    if (!recipe) {
      throw new NotFoundException(
        'Recipe not found',
      );
    }
    return recipe;
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
  async deleteReview(
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

  async getTrendingRecipes() {

    return this.prisma.recipe.findMany({
      select: {
        id: true,

        title: true,

        imageUrl: true,

        category: true,

        rating: true,

        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },

      orderBy: [
        {
          rating: 'desc',
        },

        {
          favorites: {
            _count: 'desc',
          },
        },
      ],

      take: 10,
    });
  }
  async getTags() {
    const tags = await this.prisma.recipeTag.groupBy({
      by: ['name'],
      _count: {
        recipeId: true,
      },
      orderBy: {
        _count: {
          recipeId: 'desc',
        },
      },
    });
    return tags.map(t => ({ name: t.name, count: t._count.recipeId }));
  }
}