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
  async create(@Req() req, @Body() dto: { productId: string; quantity: number }) {
    const userId = req.user.sub;
    let total = 0;
    try {
      const product = await this.http.axiosRef.get(
        `http://products:3000/products/${dto.productId}`,
        { timeout: 3000 },
      );

      if (product.data.stock < dto.quantity) {
        throw new BadRequestException('No hay suficiente stock');
      }

      total = product.data.price * dto.quantity;
    } catch {
      throw new BadRequestException('No se pudo crear la orden');
    }
    
    await this.client.emit('order-created', {
      userId,
      productId: dto.productId,
      total,
      quantity: dto.quantity,
    });

    return { status: 'queued' }; // 202
  }
}