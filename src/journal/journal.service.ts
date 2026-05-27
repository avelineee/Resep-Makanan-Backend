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
}
