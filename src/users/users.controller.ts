import {
  Controller,
  Get,
  Req,
  Post,
  Param,
  Delete,
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
  @UseGuards(JwtAuthGuard)
@Post('me/favorites/:recipeId')
async addFavorite(
  @Req() req: any,
  @Param('recipeId') recipeId: string,
) {
  

  const favorite =
    await this.usersService.addFavorite(
      req.user.id,
      Number(recipeId),
    );

  return {
    message: 'Recipe added to favorites successfully',
    favorite,
  };
}
@UseGuards(JwtAuthGuard)
@Get('me/favorites')
async getFavorites(@Req() req: any) {

  const favorites =
    await this.usersService.getFavorites(
      req.user.id,
    );

  return {
  success: true,
  message:
    'Favorites retrieved successfully',
  totalFavorites: favorites.length,
  favorites,
};
}
@UseGuards(JwtAuthGuard)
@Delete('me/favorites/:recipeId')
async removeFavorite(
  @Req() req: any,
  @Param('recipeId') recipeId: string,
) {

  await this.usersService.removeFavorite(
    req.user.id,
    Number(recipeId),
  );

  return {
    success: true,
    message: 'Recipe has been removed from favorites successfully',
  };
}

  @UseGuards(JwtAuthGuard)
  @Get('me/reviews')
  async getReviews(@Req() req: any) {
    const reviews = await this.usersService.getReviews(req.user.id);
    return {
      success: true,
      message: 'Reviews retrieved successfully',
      totalReviews: reviews.length,
      reviews,
    };
  }
}