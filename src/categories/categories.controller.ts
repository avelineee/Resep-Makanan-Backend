import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {Body,  Get, Post} from '@nestjs/common';

@Controller('categories')
export class CategoriesController {
    constructor(
    private categoriesService:
      CategoriesService,
  ) {}

  @Post()
  async createCategory(
    @Body() body: any,
  ) {

    const category =
      await this.categoriesService.create(
        body,
      );

    return {
      success: true,

      message:
        'Category created successfully',

      category,
    };
  }

  @Get()
  async getCategories() {

    const categories =
      await this.categoriesService.findAll();

    return {
      success: true,

      totalCategories:
        categories.length,

      categories,
    };
  }
}
