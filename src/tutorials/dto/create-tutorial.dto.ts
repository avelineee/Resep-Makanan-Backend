import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsInt } from 'class-validator';

export class CreateTutorialDto {
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
    required: false,
  })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({
    example: 'https://i.ytimg.com/thumbnail.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({
  example: 1,
})

@ApiProperty({
  example: 600,
})
@IsInt()
duration!: number;

@ApiProperty({
  example: 25000,
})
@IsInt()
price!: number;
}