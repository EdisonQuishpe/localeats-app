import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthServiceController {
  @MessagePattern({ cmd: 'auth_ping' })
  ping() {
    return {
      service: 'auth-service',
      status: 'ok',
      message: 'Auth Service está funcionando',
    };
  }
}