import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecipesModule } from './recipes/recipes.module';
import { JournalModule } from './journal/journal.module';
import { CategoriesModule } from './categories/categories.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, RecipesModule, JournalModule, CategoriesModule, NewsletterModule, DashboardModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}