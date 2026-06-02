import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Makanan Tradisional',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Kategori resep makanan khas Indonesia',
  })
  @IsOptional()
  @IsString()
  description?: string;
}