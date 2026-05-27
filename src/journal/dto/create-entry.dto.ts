import {
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

import { MealType } from '@prisma/client';

export class CreateEntryDto {

  @IsInt()
  @Min(1)
  recipeId!: number;

  @IsInt()
  @Min(1)
  dayOfWeek!: number;

  @IsEnum(MealType)
  mealType!: MealType;
}