import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { OAuth2Client } from 'google-auth-library';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

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

async googleLogin(token: string) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (!response.ok || !data.email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const email = data.email;
    const name = data.name || 'Google User';

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Create user with random password
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await this.usersService.create({
        username: name,
        email: email,
        password: hashedPassword,
        role: 'USER',
      });
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(jwtPayload);
    const { password, ...result } = user as any;

    return {
      message: 'Google login success',
      access_token,
      user: result,
    };
  } catch (error) {
    console.error('Google login error:', error);
    throw new UnauthorizedException('Google authentication failed');
  }
}

}
