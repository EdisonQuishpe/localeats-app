import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { PrismaService } from './prisma.service';

@Controller()
export class ProductServiceController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @MessagePattern({ cmd: 'product_ping' })
  ping() {
    return {
      service: 'product-service',
      status: 'ok',
      message: 'Product Service está funcionando',
    };
  }

  @MessagePattern({ cmd: 'product_db_health' })
  async checkDatabase() {
    const products = await this.prisma.product.count();
    const orders = await this.prisma.order.count();

    return {
      service: 'product-service',
      database: 'localeats_products',
      status: 'connected',
      productCount: products,
      orderCount: orders,
    };
  }
}