import { All, UseGuards, Req, HttpStatus, HttpException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Controller } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Request } from 'express';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsProxy {
  constructor(private readonly http: HttpService) {}

  @All()
  async root(@Req() req: Request) {
    try {
      const targetUrl = `http://products:3000${req.originalUrl}`;
      
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
      console.error('Products proxy error:', err.message);
      const status = err?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err?.response?.data?.message ?? 'Error forwarding to products-service';
      throw new HttpException(message, status);
    }
  }

  @All('*path')
  async forward(@Req() req: Request) {
    try {
      const targetUrl = `http://products:3000${req.originalUrl}`;
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
      const message = err?.response?.data?.message ?? 'Error forwarding to products-service';
      throw new HttpException(message, status);
    }
  }
} 