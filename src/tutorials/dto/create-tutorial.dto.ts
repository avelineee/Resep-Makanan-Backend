import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTutorialDto {

  @ApiProperty({ example: 1 })
  @IsInt()
  recipeId!: number;

  @ApiProperty({
    example: 'Cara Membuat Nasi Goreng',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'Tutorial lengkap membuat nasi goreng',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: 'https://youtube.com/watch?v=abc123',
  })
  @IsString()
  videoUrl!: string;

  @ApiProperty({
    example: 'https://example.com/thumb.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ example: 600 })
  @IsInt()
  duration!: number;

  @ApiProperty({ example: 25000 })
  @IsInt()
  price!: number;
}