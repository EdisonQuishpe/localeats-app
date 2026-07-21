import { Module } from '@nestjs/common';
import { ProductServiceController } from './product-service.controller';

@Module({
  controllers: [ProductServiceController],
  providers: [],
})
export class ProductServiceModule {}