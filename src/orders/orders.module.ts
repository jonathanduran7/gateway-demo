import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
    {
      name: 'ORDERS_PUB',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:secret123@rabbit:5672'],
        queue: 'orders_queue',
        queueOptions: { durable: true },
      },
    }]),
  HttpModule],
  controllers: [OrdersController],
})
export class OrdersModule {}