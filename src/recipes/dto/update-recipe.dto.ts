import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  prepTime?: string;

  @IsOptional()
  @IsString()
  cookTime?: string;

  @IsOptional()
  @IsInt()
  servings?: number;

  @IsOptional()
  @IsInt()
  calories?: number;

  @IsOptional()
  @IsString()
  ingredients?: string;

  @IsOptional()
  @IsString()
  steps?: string;

  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;
}