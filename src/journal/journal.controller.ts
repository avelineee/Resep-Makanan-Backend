import { Controller } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Body, Req, Post, Param, Get } from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { CreateEntryDto } from './dto/create-entry.dto';

@Controller('journals')
export class JournalController {
  constructor(private journalService: JournalService) {}
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
}