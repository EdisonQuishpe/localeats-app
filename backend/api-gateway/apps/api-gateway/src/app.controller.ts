import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtPayload } from './auth/jwt-payload.type';

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
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: Request & { user?: JwtPayload }) {
    return request.user;
  }

  @Get('products')
  @UseGuards(JwtAuthGuard)
  findAllProducts() {
    return this.productClient.send(
      { cmd: 'products_find_all' },
      {},
    );
  }

  @Get('products/:id')
  @UseGuards(JwtAuthGuard)
  findOneProduct(@Param('id') id: string) {
    return this.productClient.send(
      { cmd: 'products_find_one' },
      Number(id),
    );
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Param('id') id: string) {
    return this.productClient.send(
      { cmd: 'products_delete' },
      Number(id),
    );
  }

  // --- Orders (Pedidos) ---
  @Get('orders')
  @UseGuards(JwtAuthGuard)
  findAllOrders(@Query('userId') userId?: string) {
    return this.productClient.send(
      { cmd: 'orders_find_all' },
      { userId: userId ? Number(userId) : undefined },
    );
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  findOneOrder(@Param('id') id: string) {
    return this.productClient.send(
      { cmd: 'orders_find_one' },
      Number(id),
    );
  }

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Body()
    body: {
      userId: number;
      items: { productId: number; quantity: number }[];
    },
  ) {
    return this.productClient.send({ cmd: 'orders_create' }, body);
  }

  @Patch('orders/:id/status')
  @UseGuards(JwtAuthGuard)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.productClient.send(
      { cmd: 'orders_update_status' },
      { id: Number(id), status: body.status },
    );
  }

  // --- Users (Administración) ---
  @Get('users')
  @UseGuards(JwtAuthGuard)
  findAllUsers() {
    return this.authClient.send({ cmd: 'users_find_all' }, {});
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Param('id') id: string,
    @Body() body: { role?: string; isActive?: boolean },
  ) {
    return this.authClient.send(
      { cmd: 'users_update' },
      { id: Number(id), data: body },
    );
  }


  @Get('support/conversations')
@UseGuards(JwtAuthGuard)
findAllConversations() {
  return this.supportClient.send(
    { cmd: 'conversations_find_all' },
    {},
  );
}

@Get('support/conversations/:id')
@UseGuards(JwtAuthGuard)
findConversation(@Param('id') id: string) {
  return this.supportClient.send(
    { cmd: 'conversations_find_one' },
    Number(id),
  );
}

@Post('support/conversations')
@UseGuards(JwtAuthGuard)
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
@UseGuards(JwtAuthGuard)
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
@UseGuards(JwtAuthGuard)
closeConversation(@Param('id') id: string) {
  return this.supportClient.send(
    { cmd: 'conversations_close' },
    Number(id),
  );
}

  // --- Notifications ---
  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  findNotifications(@Query('userId') userId: string) {
    return this.supportClient.send(
      { cmd: 'notifications_find_by_user' },
      Number(userId),
    );
  }

  @Post('notifications')
  @UseGuards(JwtAuthGuard)
  createNotification(
    @Body()
    body: {
      type: string;
      title: string;
      body: string;
      link?: string;
      userId: number;
    },
  ) {
    return this.supportClient.send(
      { cmd: 'notifications_create' },
      body,
    );
  }

  @Patch('notifications')
  @UseGuards(JwtAuthGuard)
  markNotificationsRead(@Body() body: { userId: number }) {
    return this.supportClient.send(
      { cmd: 'notifications_mark_read' },
      Number(body.userId),
    );
  }
}