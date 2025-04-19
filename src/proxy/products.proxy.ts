import { All, Req, HttpStatus, HttpException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Controller } from "@nestjs/common";
import { Request } from 'express';

@Controller('products')
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
      console.error('Products proxy error:', err.message);
      const status = err?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err?.response?.data?.message ?? 'Error forwarding to products-service';
      throw new HttpException(message, status);
    }
  }


} 