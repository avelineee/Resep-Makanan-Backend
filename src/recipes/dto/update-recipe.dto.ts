import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsString,
  IsOptional,
  IsInt,
} from 'class-validator';

export class UpdateRecipeDto {

  @ApiPropertyOptional({
    example: 'Ayam Bakar Taliwang',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Ayam bakar khas Lombok dengan bumbu pedas manis',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/xxx/image/upload/ayam.jpg',
  })
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'Makan Siang',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: '20 min',
  })
  @IsOptional()
  @IsString()
  prepTime?: string;

  @ApiPropertyOptional({
    example: '45 min',
  })
  @IsOptional()
  @IsString()
  cookTime?: string;

  @ApiPropertyOptional({
    example: 4,
  })
  @IsOptional()
  @IsInt()
  servings?: number;

  @ApiPropertyOptional({
    example: 600,
  })
  @IsOptional()
  @IsInt()
  calories?: number;

  @ApiPropertyOptional({
    example: '[{"name":"Ayam","amount":"1 ekor"}]',
  })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiPropertyOptional({
    example: '[{"stepNumber":1,"description":"Bersihkan ayam"}]',
  })
  @IsOptional()
  @IsString()
  steps?: string;
}