import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {

  @ApiProperty({
    example: 'aveline',
  })
  @IsString()
  username!: string;

  @ApiProperty({
    example: 'aveline@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123',
  })
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'USER',
    enum: ['ADMIN', 'USER'],
  })
  @IsIn(['ADMIN', 'USER'])
  role!: string;
}