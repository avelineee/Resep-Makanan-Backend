import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum TransactionStatusDto {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class VerifyTransactionDto {
  @ApiProperty({
    enum: TransactionStatusDto,
    example: TransactionStatusDto.SUCCESS,
  })
  @IsEnum(TransactionStatusDto)
  status!: TransactionStatusDto;
}