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
}