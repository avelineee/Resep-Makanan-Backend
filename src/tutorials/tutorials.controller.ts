import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TutorialsService }from './tutorials.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tutorials')
export class TutorialsController {
  constructor(
    private tutorialsService:
      TutorialsService,
  ) {}

  @Post()
  async createTutorial(
    @Body() body: any,
  ) {

    const tutorial =
      await this.tutorialsService.create(
        body,
      );

    return {
      success: true,

      message:
        'Tutorial created successfully',

      tutorial,
    };
  }

  @Get()
  async getTutorials() {

    const tutorials =
      await this.tutorialsService.findAll();

    return {
      success: true,

      totalTutorials:
        tutorials.length,

      tutorials,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTutorialDetail(
    @Param('id') id: string,
    @Req() req: any,
  ) {

    const tutorial =
      await this.tutorialsService.findOne(
        Number(id),
      );

    return {
      success: true,

      tutorial,
    };
  }

  @UseGuards(JwtAuthGuard)
@Get(':id/watch')
async watchTutorial(
  @Param('id') id: string,

  @Req() req: any,
) {

  const tutorial =
    await this.tutorialsService
      .watchTutorial(
        Number(id),
        req.user,
      );

  return {
    success: true,

    message:
      'Tutorial video retrieved successfully',

    videoUrl:
      tutorial.videoUrl,
  };
}
}