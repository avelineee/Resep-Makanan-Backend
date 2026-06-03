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
import {
  ApiBody, ApiConsumes,
} from '@nestjs/swagger';




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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        prepTime: { type: 'string' },
        cookTime: { type: 'string' },
        servings: { type: 'number' },
        calories: { type: 'number' },
        ingredients: {
          type: 'string',
          example:
            '[{"name":"Mie","amount":"200 gram"}]',
        },

        steps: {
          type: 'string',
          example:
            '[{"stepNumber":1,"description":"Rebus mie"}]',
        },

        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createRecipe(
    @Req() req: any,
    @Body() dto: CreateRecipeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const status =
      req.user.role === 'ADMIN'
        ? 'APPROVED'
        : 'PENDING';

    let imageUrl: string | undefined;

    if (file) {
      const uploaded: any =
        await this.cloudinaryService.uploadImage(file);

      imageUrl = uploaded.secure_url;
    }
    if (dto.ingredients && typeof dto.ingredients === 'string') {
      dto.ingredients = JSON.parse(dto.ingredients as any);
    }

    if (dto.steps && typeof dto.steps === 'string') {
      dto.steps = JSON.parse(dto.steps as any);
    }
    dto.servings = Number(dto.servings);
    dto.calories = Number(dto.calories);


    const recipe =
      await this.recipesService.create({
        ...dto,
        imageUrl,
        status,
        authorId: req.user.id,
      });

    return {
      message: 'Create recipe success',
      recipe,
    };
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        prepTime: { type: 'string' },
        cookTime: { type: 'string' },
        servings: { type: 'number' },
        calories: { type: 'number' },
        ingredients: { type: 'string' },
        steps: { type: 'string' },

        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image'),
  )
  async updateRecipe(
    @Req() req: any,

    @Param('id') id: string,

    @Body() dto: any,

    @UploadedFile()
    file: any,
  ) {

    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only admin can update recipe',
      );
    }

    if (file) {

      const uploaded: any =
        await this.cloudinaryService
          .uploadImage(file);

      dto.imageUrl =
        uploaded.secure_url;
    }

    // TARO DI SINI
    Object.keys(dto).forEach((key) => {
      if (dto[key] === '') {
        delete dto[key];
      }
    });

    if (
      dto.ingredients &&
      typeof dto.ingredients === 'string'
    ) {
      try {
        dto.ingredients =
          JSON.parse(dto.ingredients);
      } catch {
        delete dto.ingredients;
      }
    }

    if (
      dto.steps &&
      typeof dto.steps === 'string'
    ) {
      try {
        dto.steps =
          JSON.parse(dto.steps);
      } catch {
        delete dto.steps;
      }
    }

    const recipe =
      await this.recipesService.update(
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['APPROVED', 'REJECTED'],
        },
      },
    },
  })

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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