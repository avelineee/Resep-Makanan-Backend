import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class DashboardService {
    constructor(
    private prisma: PrismaService,
  ) {}

  async getStats() {

    const totalUsers =
      await this.prisma.user.count();

    const totalRecipes =
      await this.prisma.recipe.count();

    const totalReviews =
      await this.prisma.review.count();

    const totalFavorites =
      await this.prisma.favorite.count();

    const totalCategories =
      await this.prisma.category.count();

    const totalNewsletterSubscribers =
      await this.prisma.newsletter.count();

    return {
      totalUsers,

      totalRecipes,

      totalReviews,

      totalFavorites,

      totalCategories,

      totalNewsletterSubscribers,
    };
  }
}
