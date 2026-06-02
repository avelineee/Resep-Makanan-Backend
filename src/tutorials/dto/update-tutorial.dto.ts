import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTutorialDto {
  @ApiPropertyOptional({
    example: 'Cara Membuat Nasi Goreng',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Tutorial lengkap membuat nasi goreng spesial',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://youtube.com/watch?v=abc123',
  })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/xxx/image/upload/thumb.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}