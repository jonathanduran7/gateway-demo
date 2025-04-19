import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly userServiceUrl = 'http://users:3000'; // Update with your user-service URL

  async validateUser(loginDto: LoginDto) {
    try {
      const response = await axios.post(`${this.userServiceUrl}/auth/validate`, loginDto);
      console.log("response in gateway", response.data);
      return response.data;
    } catch (error) {
      return null;
    }
  }
} 