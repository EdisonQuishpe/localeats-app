import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';


@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,

    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,

    @Inject('SUPPORT_SERVICE')
    private readonly supportClient: ClientProxy,
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
    return this.authClient.send({ cmd: 'auth_ping' }, {});
  }

  @Get('products/health')
  checkProductService() {
    return this.productClient.send({ cmd: 'product_ping' }, {});
  }

  @Get('support/health')
  checkSupportService() {
    return this.supportClient.send({ cmd: 'support_ping' }, {});
  }

  @Get('auth/database-health')
checkAuthDatabase() {
  return this.authClient.send(
    { cmd: 'auth_db_health' },
    {},
  );
}


@Post('auth/register')
register(@Body() body: {
  name: string;
  email: string;
  password: string;
}) {
  return this.authClient.send(
    { cmd: 'auth_register' },
    body,
  );
}


}