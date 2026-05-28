import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class IngredientDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  amount?: string;
}

class StepDto {
  @IsInt()
  stepNumber!: number;

  @IsString()
  description!: string;
}

export class CreateRecipeDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  imageUrl?: string;

  @IsString()
  category!: string;

  @IsString()
  prepTime!: string;

  @IsString()
  cookTime!: string;

  @IsInt()
  servings!: number;

  @IsInt()
  calories!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps!: StepDto[];

  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}