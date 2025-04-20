import { Controller, Post, Req, Body, UseGuards, BadRequestException, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly http: HttpService,
    @Inject('ORDERS_PUB') private client: ClientProxy,
  ) {}

  @Post()
  async create(@Req() req, @Body() dto: { productId: string; total: number }) {
    const userId = req.user.sub;

    try {
      await this.http.axiosRef.get(
        `http://products:3000/products/${dto.productId}`,
        { timeout: 3000 },
      );
    } catch {
      throw new BadRequestException('Producto inexistente');
    }
    
    await this.client.emit('order-created', {
      userId,
      productId: dto.productId,
      total: dto.total,
    });

    return { status: 'queued' }; // 202
  }
}