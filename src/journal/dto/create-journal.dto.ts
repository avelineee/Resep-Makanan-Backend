import { IsDateString } from 'class-validator';

export class CreateJournalDto {

  @IsDateString()
  weekStart!: string;
}