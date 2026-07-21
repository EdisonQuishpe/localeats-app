import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  create(data: {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    ownerId?: number;
  }) {
    return this.prisma.product.create({
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        imageUrl: data.imageUrl || null,
        ownerId: data.ownerId || null,
      },
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      available?: boolean;
    },
  ) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Producto eliminado correctamente',
    };
  }
}