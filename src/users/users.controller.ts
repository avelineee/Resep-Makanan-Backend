import {
  Controller,
  Get,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Req() req: any) {

    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admin can access this endpoint',
      );
    }

    const users = await this.usersService.findAll();

    return {
      message: 'Get all users success',
      users,
    };
  }
}