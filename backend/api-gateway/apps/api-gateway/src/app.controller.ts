import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @Get()
  getGatewayStatus() {
    return {
      service: 'api-gateway',
      status: 'ok',
    };
  }

  @Get('auth/health')
  checkAuthService() {
    return this.authClient.send(
      { cmd: 'auth_ping' },
      {},
    );
  }
}