import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import {
  ApiProperty, ApiPropertyOptional,} from '@nestjs/swagger';


class IngredientDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  amount?: string;
}

class StepDto {
  @ApiProperty()
  @IsInt()
  stepNumber!: number;

  @ApiProperty()
  @IsString()
  description!: string;
}

export class CreateRecipeDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  category!: string;

  @ApiProperty()
  @IsString()
  prepTime!: string;

  @ApiProperty()
  @IsString()
  cookTime!: string;

  @ApiProperty()
  @IsInt()
  servings!: number;

  @ApiProperty()
  @IsInt()
  calories!: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps!: StepDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  
}