import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Patch,
  Param,
  UseGuards,

  ForbiddenException,
} from '@nestjs/common';

import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Delete } from '@nestjs/common';
import { title } from 'process';
import { CreateReviewDto } from './dto/create-review.dto';
import { Query } from '@nestjs/common';
import { UploadedFile, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AnyNaptrRecord } from 'dns';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('recipes')
export class RecipesController {
  constructor(
    private recipesService:
      RecipesService,

    private cloudinaryService:
      CloudinaryService,
  ) { }

  @Get()
  async getAllRecipes(
    @Query('search') search?: string,

    @Query('category') category?: string,

    @Query('page') page = '1',

    @Query('limit') limit = '100',

    @Query('status') status?: string,
  ) {

    const recipes =
      await this.recipesService.findAll(
        search,
        category,
        Number(page),
        Number(limit),
        status
      );

    return {
      success: true,

      message:
        recipes.length > 0
          ? 'Recipes retrieved successfully'
          : 'No recipes found for this search or category',

      totalRecipes: recipes.length,

      recipes,
    };
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRecipe(
    @Req() req: any,
    @Body() dto: any,
  ) {
    // Normal users create PENDING recipes, Admins create APPROVED recipes (or custom)
    const status = req.user.role === 'ADMIN' ? (dto.status || 'APPROVED') : 'PENDING';
    
    const recipe = await this.recipesService.create({
      ...dto,
      status,
      authorId: req.user.id
    });

    return {
      message: 'Create recipe success',
      recipe,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateRecipe(
    @Req() req: any,

    @Param('id') id: string,

    @Body() dto: UpdateRecipeDto,
  ) {

    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admin can update recipe',
      );
    }

    const recipe = await this.recipesService.update(
      Number(id),
      dto,
    );

    return {
      message: 'Update recipe success',
      recipe,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/verify')
  async verifyRecipe(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can verify recipes');
    }
    const recipe = await this.recipesService.verifyRecipe(Number(id), status);
    return {
      success: true,
      message: `Recipe has been ${status.toLowerCase()}`,
      recipe,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRecipe(
    @Req() req: any,
    @Param('id') id: string,
  ) {

    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admin can delete recipe',
      );
    }

    await this.recipesService.remove(Number(id));

    return {
      success: true,
      message: 'Recipe has been deleted successfully',
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  async createReview(
    @Req() req: any,

    @Param('id') id: string,

    @Body() dto: CreateReviewDto,
  ) {

    const review =
      await this.recipesService.createReview(
        req.user.id,
        Number(id),
        dto,
      );

    return {
      success: true,

      message:
        'Review has been added successfully',

      review,
    };
  }
  @Get(':id/reviews')
  async getReviews(
    @Param('id') id: string,
  ) {

    const reviews =
      await this.recipesService.getReviews(
        Number(id),
      );

    return {
      success: true,

      message:
        'Recipe reviews retrieved successfully',

      totalReviews: reviews.length,

      reviews,
    };
  }
  @ApiBearerAuth()  
  @UseGuards(JwtAuthGuard)
  @Delete(':id/reviews')
  async deleteReview(
    @Req() req: any,

    @Param('id') id: string,
  ) {

    await this.recipesService.deleteReview(
      req.user.id,
      Number(id),
    );

    return {
      success: true,

      message:
        'Review has been deleted successfully',
    };
  }
  @Get('trending')
  async getTrendingRecipes() {

    const recipes =
      await this.recipesService.getTrendingRecipes();

    return {
      success: true,

      message:
        recipes.length > 0
          ? 'Trending recipes retrieved successfully'
          : 'No trending recipes available',

      totalRecipes: recipes.length,

      recipes,
    };
  }

  @Get('tags')
  async getTags() {
    const tags = await this.recipesService.getTags();
    return {
      success: true,
      tags,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getRecipeDetail(
    @Param('id') id: string,
    @Req() req: any,
  ) {

    const recipe =
      await this.recipesService.findOne(
        Number(id),
        req.user,
      );

    return {
      success: true,

      message:
        'Recipe detail retrieved successfully',

      recipe,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image'),
  )
  async uploadRecipeImage(
    @UploadedFile()
    file: any
  ) {

    const uploadedImage: any =
      await this.cloudinaryService
        .uploadImage(file);

    return {
      success: true,

      message:
        'Image uploaded successfully',

      imageUrl:
        uploadedImage.secure_url,
    };
  }

}