import { Module } from '@nestjs/common';
import { ProductServiceController } from './product-service.controller';
import { PrismaService } from './prisma.service';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductServiceController],
  providers: [
    PrismaService,
    ProductsService,
  ],
})
export class ProductServiceModule {}