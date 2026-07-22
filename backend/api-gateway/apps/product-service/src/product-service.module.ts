import { Module } from '@nestjs/common';
import { ProductServiceController } from './product-service.controller';
import { PrismaService } from './prisma.service';
import { ProductsService } from './products.service';
import { OrdersService } from './orders.service';

@Module({
  controllers: [ProductServiceController],
  providers: [
    PrismaService,
    ProductsService,
    OrdersService,
  ],
})
export class ProductServiceModule {}