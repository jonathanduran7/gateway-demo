import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersProxy } from './proxy/users.proxy';
import { ProductsProxy } from './proxy/products.proxy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'ORDERS_PUB',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbit:5672'],
          queue: 'orders_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AppController, UsersProxy, ProductsProxy, OrdersController],
  providers: [AppService],
})
export class AppModule {}
