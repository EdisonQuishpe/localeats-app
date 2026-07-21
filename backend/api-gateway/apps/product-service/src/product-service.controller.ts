import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ProductServiceController {
  @MessagePattern({ cmd: 'product_ping' })
  ping() {
    return {
      service: 'product-service',
      status: 'ok',
      message: 'Product Service está funcionando',
    };
  }
}