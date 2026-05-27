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

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  async getAllRecipes() {
    const recipes = await this.recipesService.findAll();

    return {
      message: 'Get all recipes success',
      recipes,
    };
  }
  @Get(':id')
async getRecipeById(
  @Param('id') id: string,
) {

  const recipe = await this.recipesService.findOne(
    Number(id),
  );

  return {
    message: 'Get recipe detail success',
    recipe,
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
}