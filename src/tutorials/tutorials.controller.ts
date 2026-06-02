import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

import { TutorialsService } from './tutorials.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Controller('tutorials')
export class TutorialsController {
  constructor(
    private tutorialsService: TutorialsService,
    private cloudinaryService: CloudinaryService,
  ) { }

@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },

      description: {
        type: 'string',
      },

      videoUrl: {
        type: 'string',
      },

      thumbnailUrl: {
        type: 'string',
      },

      video: {
        type: 'string',
        format: 'binary',
      },

      thumbnail: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})

@Post()
async createTutorial(
  @Body() body: any,
) {
  const tutorial =
    await this.tutorialsService.create(body);

  return {
    success: true,
    message: 'Tutorial created successfully',
    tutorial,
  };
}

  @Get()
  async getTutorials() {
    const tutorials = await this.tutorialsService.findAll();
    return {
      success: true,
      totalTutorials: tutorials.length,
      tutorials,
    };
  }

  @Get(':id')
  async getTutorialDetail(
    @Param('id') id: string,
  ) {
    const tutorial = await this.tutorialsService.findOne(Number(id));
    return {
      success: true,
      tutorial,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/watch')
  async watchTutorial(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const tutorial = await this.tutorialsService.watchTutorial(Number(id), req.user);
    return {
      success: true,
      message: 'Tutorial video retrieved successfully',
      videoUrl: tutorial.videoUrl,
    };
  }

  @UseGuards(JwtAuthGuard)
@Patch(':id')
async updateTutorial(
  @Param('id') id: string,
  @Body() dto: UpdateTutorialDto,
) {
  const tutorial =
    await this.tutorialsService.update(
      Number(id),
      dto,
    );

  return {
    success: true,
    message: 'Tutorial updated successfully',
    tutorial,
  };
}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTutorial(
    @Param('id') id: string,
  ) {
    await this.tutorialsService.remove(Number(id));
    return {
      success: true,
      message: 'Tutorial deleted successfully',
    };
  }

  // ── Upload endpoints ────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload/video')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result: any = await this.cloudinaryService.uploadVideo(file);
    return {
      success: true,
      message: 'Video uploaded successfully',
      videoUrl: result.secure_url,
      publicId: result.public_id,
      duration: Math.round(result.duration || 0),
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      thumbnail: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
  @Post('upload/thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result: any = await this.cloudinaryService.uploadThumbnail(file);
    return {
      success: true,
      message: 'Thumbnail uploaded successfully',
      thumbnailUrl: result.secure_url,
      publicId: result.public_id,
    };
  }
}