import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  UnauthorizedException,
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
    return this.authClient.send({ cmd: 'auth_db_health' }, {});
  }

  @Get('products/database-health')
  checkProductDatabase() {
    return this.productClient.send({ cmd: 'product_db_health' }, {});
  }

  @Get('support/database-health')
  checkSupportDatabase() {
    return this.supportClient.send({ cmd: 'support_db_health' }, {});
  }

  @Post('auth/register')
  register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
    },
  ) {
    return this.authClient.send({ cmd: 'auth_register' }, body);
  }

  @Post('auth/login')
  login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.authClient.send({ cmd: 'auth_login' }, body);
  }

  @Get('auth/profile')
  getProfile(
    @Headers('authorization') authorization?: string,
  ) {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Debe enviar un token Bearer',
      );
    }

    const token = authorization
      .replace('Bearer ', '')
      .trim();

    return this.authClient.send(
      { cmd: 'auth_validate_token' },
      token,
    );
  }

  @Get('products')
  findAllProducts() {
    return this.productClient.send(
      { cmd: 'products_find_all' },
      {},
    );
  }

  @Get('products/:id')
  findOneProduct(@Param('id') id: string) {
    return this.productClient.send(
      { cmd: 'products_find_one' },
      Number(id),
    );
  }

  @Post('products')
  createProduct(
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
      ownerId?: number;
    },
  ) {
    return this.productClient.send(
      { cmd: 'products_create' },
      body,
    );
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      available?: boolean;
    },
  ) {
    return this.productClient.send(
      { cmd: 'products_update' },
      {
        id: Number(id),
        data: body,
      },
    );
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productClient.send(
      { cmd: 'products_delete' },
      Number(id),
    );
  }


  @Get('support/conversations')
findAllConversations() {
  return this.supportClient.send(
    { cmd: 'conversations_find_all' },
    {},
  );
}

@Get('support/conversations/:id')
findConversation(@Param('id') id: string) {
  return this.supportClient.send(
    { cmd: 'conversations_find_one' },
    Number(id),
  );
}

@Post('support/conversations')
createConversation(
  @Body()
  body: {
    subject: string;
    userId?: number;
  },
) {
  return this.supportClient.send(
    { cmd: 'conversations_create' },
    body,
  );
}

@Post('support/messages')
createSupportMessage(
  @Body()
  body: {
    content: string;
    senderRole: string;
    conversationId: number;
    userId?: number;
  },
) {
  return this.supportClient.send(
    { cmd: 'messages_create' },
    body,
  );
}

@Patch('support/conversations/:id/close')
closeConversation(@Param('id') id: string) {
  return this.supportClient.send(
    { cmd: 'conversations_close' },
    Number(id),
  );
}
}