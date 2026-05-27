import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  private jwtService: JwtService,) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
  username: dto.username,
  email: dto.email,
  password: hashedPassword,
  role: dto.role as 'ADMIN' | 'USER',
});
    const { password, ...result } = user;

return {
  message: 'Register success',
  user: result,
};
  }

  async registerAdmin(dto: RegisterDto) {
  const existingUser = await this.usersService.findByEmail(dto.email);

  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.usersService.create({
    username: dto.username,
    email: dto.email,
    password: hashedPassword,
    role: 'ADMIN',
  });

  return {
    message: 'Admin register success',
    user,
  };
}
async login(dto: LoginDto) {
  const user = await this.usersService.findByEmail(dto.email);

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(
    dto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const access_token = await this.jwtService.signAsync(payload);

  const { password, ...result } = user;

  return {
    message: 'Login success',
    access_token,
    user: result,
  };
}

}
