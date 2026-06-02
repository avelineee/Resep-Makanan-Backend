import { Controller } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Body, Req, Post, Param, Get, Delete } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { CreateEntryDto } from './dto/create-entry.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('journals')
export class JournalController {
  constructor(private journalService: JournalService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createJournal(
    @Req() req: any,

    @Body() dto: CreateJournalDto,
  ) {

    const journal =
      await this.journalService.createJournal(
        req.user.id,
        dto.weekStart,
      );

    return {
      success: true,

      message:
        'Weekly journal has been created successfully',

      journal,
    };
  }

  @UseGuards(JwtAuthGuard)
@Post(':journalId/entries')
async addEntry(
  @Req() req: any,

  @Param('journalId') journalId: string,

  @Body() dto: CreateEntryDto,
) {

  const entry =
    await this.journalService.addEntry(
      req.user.id,
      Number(journalId),
      dto,
    );

  return {
    success: true,

    message:
      'Recipe has been added to journal successfully',

    entry,
  };
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get('me')
async getMyJournals(
  @Req() req: any,
) {

  const journals =
    await this.journalService.getMyJournals(
      req.user.id,
    );

  return {
    success: true,

    message:
      'Journals retrieved successfully',

    totalJournals: journals.length,

    journals,
  };
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Delete('entries/:entryId')
async deleteEntry(
  @Req() req: any,

  @Param('entryId') entryId: string,
) {

  await this.journalService.deleteEntry(
    req.user.id,
    Number(entryId),
  );

  return {
    success: true,

    message:
      'Journal entry has been deleted successfully',
  };
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Get('shopping-list')
async getShoppingList(
  @Req() req: any,
) {

  const shoppingList =
    await this.journalService.getShoppingList(
      req.user.id,
    );

  return {
    success: true,

    totalItems:
      shoppingList.length,

    shoppingList,
  };
}
}