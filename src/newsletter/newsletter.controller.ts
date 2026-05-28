import { Controller } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import {Body,  Get, Post} from '@nestjs/common';

@Controller('newsletter')
export class NewsletterController {
  constructor(
    private newsletterService:
      NewsletterService,
  ) {}

  @Post('subscribe')
  async subscribe(
    @Body('email') email: string,
  ) {

    const subscriber =
      await this.newsletterService.subscribe(
        email,
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
