import {Injectable,NotFoundException,} from '@nestjs/common';

import { PrismaService }from 'src/prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    userId: number,
    tutorialId: number,
    paymentProof: string | null,
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
          paymentProof,

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
            email: true,
          
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
async getTransactionSummary(
  userId: number,
) {

  const transactions =
    await this.prisma.transaction.findMany({
      where: {
        userId,
        status: 'SUCCESS',
      },

      include: {
        tutorial: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

  const totalSpent =
    transactions.reduce(
      (sum, trx) =>
        sum + trx.amount,
      0,
    );

  return {
    totalTutorials:
      transactions.length,

    totalSpent,

    transactions,
  };
}

async downloadHistory(
  userId: number,
  res: any,
) {

  const transactions =
    await this.prisma.transaction.findMany({
      where: {
        userId,
        status: 'SUCCESS',
      },

      include: {
        tutorial: true,
      },
    });

  const doc = new PDFDocument({
  margin: 50,
});

res.setHeader(
  'Content-Type',
  'application/pdf',
);

res.setHeader(
  'Content-Disposition',
  'attachment; filename=riwayat-pembelian.pdf',
);

doc.pipe(res);

// Header
doc
  .fontSize(24)
  .text('DAPUR NUSANTARA', {
    align: 'center',
  });

doc
  .fontSize(16)
  .text('Laporan Pembelian Tutorial', {
    align: 'center',
  });

doc.moveDown();

doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`);

doc.moveDown();

doc.moveTo(50, doc.y)
   .lineTo(550, doc.y)
   .stroke();

doc.moveDown();

const user =
  await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

doc.text(
  `Nama: ${user?.username ?? '-'}`,
);

doc.text(
  `Email: ${user?.email ?? '-'}`,
);

doc.moveDown();

doc.moveTo(50, doc.y)
   .lineTo(550, doc.y)
   .stroke();

doc.moveDown();

let total = 0;

transactions.forEach(
  (trx, index) => {

    total += trx.amount;

    doc.fontSize(12)
      .text(
        `${index + 1}. ${trx.tutorial.title}`,
      );

    doc.text(
      `Harga: Rp${trx.amount.toLocaleString(
        'id-ID',
      )}`,
    );

    doc.text(
      `Tanggal: ${trx.createdAt.toLocaleDateString(
        'id-ID',
      )}`,
    );

    doc.moveDown();
  },
);

doc.moveTo(50, doc.y)
   .lineTo(550, doc.y)
   .stroke();

doc.moveDown();

doc.fontSize(14)
  .text(
    `Total Tutorial Dibeli: ${transactions.length}`,
  );

doc.text(
  `Total Pengeluaran: Rp${total.toLocaleString(
    'id-ID',
  )}`,
  {
    underline: true,
  },
);

doc.moveDown(2);

doc.fontSize(11)
  .text(
    'Terima kasih telah menggunakan Dapur Nusantara',
    {
      align: 'center',
    },
  );

doc.end();
}

}