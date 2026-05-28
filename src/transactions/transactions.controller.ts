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

import { TransactionsService }from './transactions.service';
import { JwtAuthGuard }from 'src/auth/guards/jwt-auth.guard';


@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionsService:
      TransactionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':tutorialId')
  async createTransaction(
    @Req() req: any,

    @Param('tutorialId')
    tutorialId: string,
  ) {

    const transaction =
      await this.transactionsService.create(
        req.user.id,
        Number(tutorialId),
      );

    return {
      success: true,

      message:
        'Transaction created successfully',

      transaction,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyTransactions(
    @Req() req: any,
  ) {

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
}