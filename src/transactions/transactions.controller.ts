import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
    ForbiddenException,
} from '@nestjs/common';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { TransactionsService }from './transactions.service';
import { JwtAuthGuard }from 'src/auth/guards/jwt-auth.guard';
import {UploadedFile, UseInterceptors,} from '@nestjs/common';
import { FileInterceptor }from '@nestjs/platform-express';
import { CloudinaryService }from 'src/cloudinary/cloudinary.service';
import { ApiBearerAuth } from '@nestjs/swagger';




@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionsService:
      TransactionsService,
       private cloudinaryService:
    CloudinaryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
@Post(':tutorialId')
@UseInterceptors(
  FileInterceptor('paymentProof'),
)
async createTransaction(
  @Req() req: any,

  @Param('tutorialId')
  tutorialId: string,

  @UploadedFile()
  file: any,

  
)
 {
  let paymentProof: string | null =
    null;

  if (file) {

    const uploadedImage: any =
      await this.cloudinaryService
        .uploadImage(file);
        console.log(uploadedImage);

    paymentProof =
      uploadedImage.secure_url;
  }
  console.log(req.user);

  const transaction =
    await this.transactionsService.create(
  req.user.id,
  Number(tutorialId),
  paymentProof,
);

  return {
    success: true,
    message:
      'Transaction created successfully',
    transaction,
  };
}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyTransactions(
    @Req() req: any,

  ) 
  
  {

    const transactions =
      await this.transactionsService
        .findMyTransactions(
          req.user.id,
        );

    return {
      success: true,

      totalTransactions:
        transactions.length,

      transactions,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTransactions(
    @Req() req: any,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admin can view all transactions',
      );
    }

    const transactions =
      await this.transactionsService.findAllTransactions();

    return {
      success: true,
      totalTransactions: transactions.length,
      transactions,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
@Patch(':id/verify')
async verifyTransaction(
  @Req() req: any,

  @Param('id') id: string,
) {

  if (req.user.role !== 'ADMIN') {
    throw new ForbiddenException(
      'Only admin can verify transaction',
    );
  }

  const transaction =
    await this.transactionsService
      .verifyTransaction(
        Number(id),
      );

  return {
    success: true,

    message:
      'Transaction verified successfully',

    transaction,
  };
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get('summary')
async getTransactionSummary(
  @Req() req: any,
) {
  return this.transactionsService
    .getTransactionSummary(
      req.user.id,
    );
}

@Get('download-history')
@UseGuards(JwtAuthGuard)
async downloadHistory(
  @Req() req: any,
  @Res() res: any,
) {

  return this.transactionsService
    .downloadHistory(
      req.user.id,
      res,
    );
}

}