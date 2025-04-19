import { All, UseGuards, Req, HttpStatus, HttpException, Get, Param } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Controller } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersProxy {
  constructor(private readonly http: HttpService) {}

  @All()
  async root(@Req() req: Request) {
    try {
      const targetUrl = `http://users:3000${req.originalUrl}`;
      const response = await this.http.axiosRef({
        url: targetUrl,
        method: req.method,
        data: req.body,
        headers: {
          host: undefined,
        },
      })
    
    return response.data;
    } catch (err: any) {
      const status = err?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err?.response?.data?.message ?? 'Error forwarding to users-service';
      throw new HttpException(message, status);
    }
  }

  @All('*path')
  async forward(@Req() req: Request) {
    try {
      const targetUrl = `http://users:3000${req.originalUrl}`;
      const response = await this.http.axiosRef({
        url: targetUrl,
        method: req.method,
        data: req.body,
        headers: {
          host: undefined,
        },
      });
      
      return response.data;
    } catch (err: any) {
      console.error('Proxy error:', err.message);
      const status = err?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err?.response?.data?.message ?? 'Error forwarding to users-service';
      throw new HttpException(message, status);
    }
  }
}