import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  private readonly userServiceUrl = 'http://users:3000'; // Update with your user-service URL

  async validateUser(loginDto: LoginDto) {
    try {
      const response = await axios.post(`${this.userServiceUrl}/auth/validate`, loginDto);
      const user = response.data;
      
      if (user) {
        const payload = { sub: user.id, email: user.email };
        return {
          access_token: this.jwtService.sign(payload),
          user,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
} 