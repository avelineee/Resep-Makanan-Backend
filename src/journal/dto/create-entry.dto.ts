import { ApiProperty } from '@nestjs/swagger';
import { MealType } from '@prisma/client';
import { IsEnum, IsInt, Min } from 'class-validator';

export class CreateEntryDto {

  @ApiProperty({
    example: 39,
  })
  @IsInt()
  @Min(1)
  recipeId!: number;

  @ApiProperty({
    example: 1,
    description: '1=Senin, 2=Selasa, ..., 7=Minggu',
  })
  @IsInt()
  @Min(1)
  dayOfWeek!: number;

  @ApiProperty({
    enum: MealType,
    example: MealType.LUNCH,
  })
  @IsEnum(MealType)
  mealType!: MealType;
}