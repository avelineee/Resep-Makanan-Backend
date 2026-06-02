import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
} from 'class-validator';

export class LoginDto {

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
}