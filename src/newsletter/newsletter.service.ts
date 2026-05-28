import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsletterService {
constructor(
    private prisma: PrismaService,
  ) {}

  async subscribe(email: string) {

    const existingEmail =
      await this.prisma.newsletter.findUnique({
        where: {
          email,
        },
      });

    if (existingEmail) {
      throw new BadRequestException(
        'Email already subscribed',
      );
    }

    return this.prisma.newsletter.create({
      data: {
        email,
      },
    });
  }
  async findAll() {

  return this.prisma.newsletter.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}
