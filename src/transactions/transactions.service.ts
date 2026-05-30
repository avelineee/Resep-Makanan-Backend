import {Injectable,NotFoundException,} from '@nestjs/common';

import { PrismaService }from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    userId: number,
    tutorialId: number,
  ) {

    const tutorial =
      await this.prisma.tutorial.findUnique({
        where: {
          id: tutorialId,
        },
      });

    if (!tutorial) {
      throw new NotFoundException(
        'Tutorial not found',
      );
    }

    return this.prisma.transaction.create({
      data: {
        userId,

        tutorialId,

        amount:
          tutorial.price,

        status: 'PENDING',
      },
    });
  }

  async findMyTransactions(
    userId: number,
  ) {

    return this.prisma.transaction.findMany({
      where: {
        userId,
      },

      include: {
        tutorial: {
          include: {
            recipe: true
          }
        }
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllTransactions() {
    return this.prisma.transaction.findMany({
      include: {
        tutorial: {
          include: {
            recipe: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async verifyTransaction(
  id: number,
) {

  const transaction =
    await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    });

  if (!transaction) {
    throw new NotFoundException(
      'Transaction not found',
    );
  }

  const updatedTransaction =
  await this.prisma.transaction.update({
    where: {
      id,
    },

    data: {
      status: 'SUCCESS',
    },
  });

await this.prisma.userTutorialAccess.create({

    data: {
      userId:
        transaction.userId,

      tutorialId:
        transaction.tutorialId,

      transactionId:
        transaction.id,
    },
  });

  await this.prisma.activity.create({
  data: {
    userId:
      transaction.userId,

    type:
      'TUTORIAL_PURCHASED',

    metadata: {
      tutorialId:
        transaction.tutorialId,

      transactionId:
        transaction.id,
    },
  },
});

return updatedTransaction;
}
}