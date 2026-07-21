import { Module } from '@nestjs/common';

import { ProductServiceController } from './product-service.controller';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [ProductServiceController],
  providers: [PrismaService],
})
export class ProductServiceModule {}