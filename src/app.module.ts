import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersProxy } from './proxy/users.proxy';
import { ProductsProxy } from './proxy/products.proxy';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    OrdersModule
  ],
  controllers: [AppController, UsersProxy, ProductsProxy],
  providers: [AppService],
})
export class AppModule {}
