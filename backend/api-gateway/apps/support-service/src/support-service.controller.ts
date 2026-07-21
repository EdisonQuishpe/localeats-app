import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class SupportServiceController {
  @MessagePattern({ cmd: 'support_ping' })
  ping() {
    return {
      service: 'support-service',
      status: 'ok',
      message: 'Support Service está funcionando',
    };
  }
}