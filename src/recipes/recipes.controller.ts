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

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
async getAllRecipes(
  @Query('search') search?: string,

  @Query('category') category?: string,
) {

  const recipes =
    await this.recipesService.findAll(
      search,
      category,
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

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRecipe(
    @Req() req: any,
    @Body() dto: CreateRecipeDto,
  ) {

    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admin can create recipe',
      );
    }

    const recipe = await this.recipesService.create(dto);

    return {
      message: 'Create recipe success',
      recipe,
    };
  }
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

}