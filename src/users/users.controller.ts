import {
  Controller,
  Get,
  Req,
  Post,
  Param,
  Delete,
  Patch,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private cloudinaryService: CloudinaryService) {}

  @ApiBearerAuth()
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

  @ApiBearerAuth()
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

@ApiBearerAuth()
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
@ApiBearerAuth()
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

@ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
@Patch(':id')
@UseInterceptors(
  FileInterceptor('image'),
)
async updateUser(
  @Req() req: any,

  @Param('id') id: string,

  @Body() body: any,

  @UploadedFile()
  file: any,
) {

  const targetUserId =
    Number(id);

  const isAdmin =
    req.user.role === 'ADMIN';

  const isOwnProfile =
    req.user.id === targetUserId;

  if (!isAdmin && !isOwnProfile) {
    throw new ForbiddenException(
      'You can only update your own profile',
    );
  }

  if (file) {

    const uploadedImage: any =
      await this.cloudinaryService
        .uploadImage(file);

    body.profileImage =
      uploadedImage.secure_url;
  }

  return this.usersService.update(
    targetUserId,
    body,
  );
}
}