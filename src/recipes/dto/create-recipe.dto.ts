import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

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

  @IsString()
  ingredients!: string;

  @IsString()
  steps!: string;

  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;
}