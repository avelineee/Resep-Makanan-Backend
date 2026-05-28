import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException, } from '@nestjs/common';

@Injectable()
export class JournalService {
constructor(
    private prisma: PrismaService,
  ) {}

  async createJournal(
    userId: number,
    weekStart: string,
  ) {

    const existingJournal =
      await this.prisma.journal.findUnique({
        where: {
          userId_weekStart: {
            userId,
            weekStart: new Date(weekStart),
          },
        },
      });

    if (existingJournal) {
      throw new BadRequestException(
        'Journal for this week already exists',
      );
    }

    return this.prisma.journal.create({
      data: {
        userId,
        weekStart: new Date(weekStart),
      },
    });
  }



  async addEntry(
  userId: number,
  journalId: number,
  dto: any,
) {

  const journal =
    await this.prisma.journal.findFirst({
      where: {
        id: journalId,
        userId,
      },
    });

  if (!journal) {
    throw new NotFoundException(
      'Journal not found',
    );
  }

  const recipe =
    await this.prisma.recipe.findUnique({
      where: {
        id: dto.recipeId,
      },
    });

  if (!recipe) {
    throw new NotFoundException(
      'Recipe not found',
    );
  }

  const existingEntry =
    await this.prisma.journalEntry.findUnique({
      where: {
        journalId_dayOfWeek_mealType: {
          journalId,
          dayOfWeek: dto.dayOfWeek,
          mealType: dto.mealType,
        },
      },
    });

  if (existingEntry) {
    throw new BadRequestException(
      'Meal already exists for this time',
    );
  }

  return this.prisma.journalEntry.create({
    data: {
      journalId,
      recipeId: dto.recipeId,
      dayOfWeek: dto.dayOfWeek,
      mealType: dto.mealType,
    },
  });
}
async getMyJournals(userId: number) {

  return this.prisma.journal.findMany({
    where: {
      userId,
    },

    include: {
      entries: {
        include: {
          recipe: true,
        },

        orderBy: {
          dayOfWeek: 'asc',
        },
      },
    },

    orderBy: {
      weekStart: 'desc',
    },
  });
}
async deleteEntry(
  userId: number,
  entryId: number,
) {

  const entry =
    await this.prisma.journalEntry.findUnique({
      where: {
        id: entryId,
      },

      include: {
        journal: true,
      },
    });

  if (!entry) {
    throw new NotFoundException(
      'Journal entry not found',
    );
  }

  if (entry.journal.userId !== userId) {
    throw new BadRequestException(
      'You are not allowed to delete this journal entry',
    );
  }

  await this.prisma.journalEntry.delete({
    where: {
      id: entryId,
    },
  });

  return;
}
async getShoppingList(userId: number) {

  const journals =
    await this.prisma.journal.findMany({
      where: {
        userId,
      },

      include: {
        entries: {
          include: {
            recipe: {
              include: {
                ingredientItems: true,
              },
            },
          },
        },
      },
    });

  const shoppingList: { name: string; amount: string | null }[] = [];

  journals.forEach((journal) => {
    journal.entries.forEach((entry) => {
      const recipe = entry.recipe;
      if (recipe && recipe.ingredients) {
        try {
          const ingredientsArr = JSON.parse(recipe.ingredients);
          if (Array.isArray(ingredientsArr)) {
            ingredientsArr.forEach((ing: any) => {
              if (typeof ing === 'string') {
                shoppingList.push({
                  name: ing,
                  amount: null,
                });
              } else if (typeof ing === 'object' && ing !== null) {
                shoppingList.push({
                  name: ing.name || 'Unknown',
                  amount: ing.amount || null,
                });
              }
            });
          }
        } catch (e) {
          // Fallback if not JSON
          shoppingList.push({ name: recipe.ingredients, amount: null });
        }
      }
    });
  });

  return shoppingList;
}
}

