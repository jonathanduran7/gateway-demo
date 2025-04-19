import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('loginDto', loginDto);
    const user = await this.authService.validateUser(loginDto);
    console.log('user', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}