import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { ProductsService } from './products.service';
import { OrdersService } from './orders.service';

@Controller()
export class ProductServiceController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
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

  // ---------- Pedidos (Orders) ----------
  @MessagePattern({ cmd: 'orders_find_all' })
  findAllOrders(@Payload() payload: { userId?: number }) {
    return this.ordersService.findAll(
      payload?.userId ? Number(payload.userId) : undefined,
    );
  }

  @MessagePattern({ cmd: 'orders_find_one' })
  findOneOrder(@Payload() id: number) {
    return this.ordersService.findOne(Number(id));
  }

  @MessagePattern({ cmd: 'orders_create' })
  createOrder(
    @Payload()
    data: {
      userId: number;
      items: { productId: number; quantity: number }[];
    },
  ) {
    return this.ordersService.create(data);
  }

  @MessagePattern({ cmd: 'orders_update_status' })
  updateOrderStatus(
    @Payload() payload: { id: number; status: string },
  ) {
    return this.ordersService.updateStatus(
      Number(payload.id),
      payload.status,
    );
  }
}