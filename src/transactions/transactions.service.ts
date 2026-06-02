import {Injectable,NotFoundException,} from '@nestjs/common';

import { PrismaService }from 'src/prisma/prisma.service';
import PDFDocument from 'pdfkit';
import { TransactionStatus } from '@prisma/client';

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
  status: 'SUCCESS' | 'FAILED',
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
      status,
    },
  });

if (status === 'SUCCESS') {

  await this.prisma.userTutorialAccess.create({
    data: {
      userId: transaction.userId,
      tutorialId: transaction.tutorialId,
      transactionId: transaction.id,
    },
  });

  await this.prisma.activity.create({
    data: {
      userId: transaction.userId,
      type: 'TUTORIAL_PURCHASED',
      metadata: {
        tutorialId: transaction.tutorialId,
        transactionId: transaction.id,
      },
    },
  });

}

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
        tutorial: {
          include: {
            recipe: true,
          },
        },
      },
    });

  const doc = new PDFDocument({
    size: 'A4',
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

  // 1. Header Banner (Forest Green background strip)
  doc.fillColor('#006d36').rect(50, 40, 495, 60).fill();

  // Logo / App Name inside banner
  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(18)
     .text('DAPUR NUSANTARA', 65, 53);

  doc.font('Helvetica')
     .fontSize(9)
     .text('Resep & Tutorial Kuliner Autentik', 65, 75);

  // Receipt Label on right side of banner
  doc.font('Helvetica-Bold')
     .fontSize(13)
     .text('NOTA PEMBELIAN', 370, 53, { width: 160, align: 'right' });

  doc.font('Helvetica')
     .fontSize(8.5)
     .text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`, 370, 75, { width: 160, align: 'right' });

  // 2. User & Transaction Info
  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  doc.fillColor('#1a1c1d')
     .font('Helvetica-Bold')
     .fontSize(9.5)
     .text('DITERBITKAN UNTUK:', 50, 125);

  doc.fillColor('#4f5e55')
     .font('Helvetica')
     .fontSize(9)
     .text(`Nama: ${user?.username ?? '-'}`, 50, 140)
     .text(`Email: ${user?.email ?? '-'}`, 50, 153);

  doc.fillColor('#1a1c1d')
     .font('Helvetica-Bold')
     .fontSize(9.5)
     .text('RINCIAN INVOICE:', 330, 125);

  doc.fillColor('#4f5e55')
     .font('Helvetica')
     .fontSize(9)
     .text(`Jumlah Item: ${transactions.length} Tutorial`, 330, 140)
     .text('Status Pembayaran: Lunas (Terverifikasi)', 330, 153);

  // 3. Table Header
  doc.fillColor('#006d36').rect(50, 185, 495, 22).fill();

  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(8.5)
     .text('NO', 58, 192)
     .text('TUTORIAL & RESEP', 80, 192)
     .text('TANGGAL BELI', 330, 192)
     .text('HARGA (IDR)', 430, 192, { width: 105, align: 'right' });

  // 4. Table Body
  let currentY = 207;
  let total = 0;

  transactions.forEach((trx, index) => {
    total += trx.amount;

    // Check page overflow
    if (currentY > 730) {
      doc.addPage();
      currentY = 50;

      // Redraw table header on new page
      doc.fillColor('#006d36').rect(50, currentY, 495, 22).fill();
      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .fontSize(8.5)
         .text('NO', 58, currentY + 7)
         .text('TUTORIAL & RESEP', 80, currentY + 7)
         .text('TANGGAL BELI', 330, currentY + 7)
         .text('HARGA (IDR)', 430, currentY + 7, { width: 105, align: 'right' });
      currentY += 24;
    }

    // Alternating Row Background
    if (index % 2 === 1) {
      doc.fillColor('#f8faf8').rect(50, currentY, 495, 22).fill();
    }

    const titleText = trx.tutorial?.recipe?.title
      ? `${trx.tutorial.title} (${trx.tutorial.recipe.title})`
      : (trx.tutorial?.title || '—');

    doc.fillColor('#1a1c1d')
       .font('Helvetica')
       .fontSize(8.5)
       .text(String(index + 1), 58, currentY + 6)
       .text(titleText, 80, currentY + 6, { width: 240, lineBreak: false })
       .text(new Date(trx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), 330, currentY + 6)
       .font('Helvetica-Bold')
       .text(`Rp ${trx.amount.toLocaleString('id-ID')}`, 430, currentY + 6, { width: 105, align: 'right' });

    // Draw separator line
    doc.strokeColor('#e1e3e0').lineWidth(0.5).moveTo(50, currentY + 22).lineTo(545, currentY + 22).stroke();
    currentY += 22;
  });

  // 5. Invoice Totals Block
  currentY += 10;
  doc.strokeColor('#006d36').lineWidth(0.8).moveTo(330, currentY).lineTo(545, currentY).stroke();

  doc.fillColor('#4f5e55')
     .font('Helvetica')
     .fontSize(8.5)
     .text('Total Item:', 330, currentY + 8)
     .fillColor('#1a1c1d')
     .text(`${transactions.length}`, 430, currentY + 8, { width: 105, align: 'right' });

  doc.fillColor('#1a1c1d')
     .font('Helvetica-Bold')
     .fontSize(9.5)
     .text('Total Pembayaran:', 330, currentY + 22)
     .fillColor('#006d36')
     .fontSize(11)
     .text(`Rp ${total.toLocaleString('id-ID')}`, 430, currentY + 22, { width: 105, align: 'right' });

  // 6. Professional Footer Message
  doc.strokeColor('#e1e3e0').lineWidth(0.5).moveTo(50, 720).lineTo(545, 720).stroke();

  doc.fillColor('#7d8a80')
     .font('Helvetica')
     .fontSize(7.5)
     .text('Dokumen ini diterbitkan secara otomatis dan sah sebagai bukti pembayaran resmi Dapur Nusantara.', 50, 735, { align: 'center', width: 495 });

  doc.fillColor('#006d36')
     .font('Helvetica-Bold')
     .fontSize(8.5)
     .text('Terima kasih telah bergabung dalam perjalanan kuliner kami!', 50, 748, { align: 'center', width: 495 });

  doc.end();
}

}