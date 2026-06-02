import { Controller } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import {Body,  Get, Post} from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(
    private newsletterService:
      NewsletterService,
  ) {}

  @Post('subscribe')
async subscribe(
  @Body() dto: CreateNewsletterDto,
) {
  const subscriber =
    await this.newsletterService.subscribe(
      dto.email,
    );

  return {
    success: true,
    message:
      'Newsletter subscription successful',
    subscriber,
  };
}
  @Get()
async getNewsletterSubscribers() {

  const subscribers =
    await this.newsletterService.findAll();

  return {
    success: true,

    totalSubscribers:
      subscribers.length,

    subscribers,
  };
}
}
