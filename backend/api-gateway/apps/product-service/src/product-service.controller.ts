import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { ProductsService } from './products.service';

@Controller()
export class ProductServiceController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  @MessagePattern({ cmd: 'product_ping' })
  ping() {
    return {
      service: 'product-service',
      status: 'ok',
    };
  }

  @MessagePattern({ cmd: 'product_db_health' })
  async checkDatabase() {
    const productCount =
      await this.prisma.product.count();

    return {
      service: 'product-service',
      database: 'localeats_products',
      status: 'connected',
      productCount,
    };
  }

  @MessagePattern({ cmd: 'products_find_all' })
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({ cmd: 'products_find_one' })
  findOne(@Payload() id: number) {
    return this.productsService.findOne(Number(id));
  }

  @MessagePattern({ cmd: 'products_create' })
  create(@Payload() data: {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    ownerId?: number;
  }) {
    return this.productsService.create(data);
  }

  @MessagePattern({ cmd: 'products_update' })
  update(
    @Payload()
    payload: {
      id: number;
      data: {
        name?: string;
        description?: string;
        price?: number;
        imageUrl?: string;
        available?: boolean;
      };
    },
  ) {
    return this.productsService.update(
      Number(payload.id),
      payload.data,
    );
  }

  @MessagePattern({ cmd: 'products_delete' })
  remove(@Payload() id: number) {
    return this.productsService.remove(Number(id));
  }
}