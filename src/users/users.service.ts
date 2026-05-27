import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    username: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findAll() {
  return this.prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isPremium: true,
      createdAt: true,
    },
  });
}
}