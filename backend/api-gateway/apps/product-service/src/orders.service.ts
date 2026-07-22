import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

interface OrderItemInput {
  productId: number;
  quantity: number;
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId?: number) {
    return this.prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return order;
  }

  async create(data: { userId: number; items: OrderItemInput[] }) {
    if (!data.items || data.items.length === 0) {
      throw new NotFoundException('El pedido no tiene productos');
    }

    // Obtener los productos para calcular el total con precios reales
    const productIds = data.items.map((item) => Number(item.productId));
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    const itemsData = data.items.map((item) => {
      const product = products.find((p) => p.id === Number(item.productId));
      if (!product) {
        throw new NotFoundException(
          `Producto ${item.productId} no encontrado`,
        );
      }
      const priceAtPurchase = Number(product.price);
      totalAmount += priceAtPurchase * item.quantity;
      return {
        productId: Number(item.productId),
        quantity: item.quantity,
        priceAtPurchase,
      };
    });

    return this.prisma.order.create({
      data: {
        userId: Number(data.userId),
        totalAmount,
        status: 'pending',
        items: {
          create: itemsData,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async updateStatus(id: number, status: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
