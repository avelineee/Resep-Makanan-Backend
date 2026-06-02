import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateJournalDto {

  @ApiProperty({
    example: '2026-06-01',
    description: 'Tanggal awal minggu',
  })
  @IsDateString()
  weekStart!: string;
}