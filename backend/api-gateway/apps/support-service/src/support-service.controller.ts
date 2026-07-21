import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { PrismaService } from './prisma.service';

@Controller()
export class SupportServiceController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @MessagePattern({ cmd: 'support_ping' })
  ping() {
    return {
      service: 'support-service',
      status: 'ok',
      message: 'Support Service está funcionando',
    };
  }

  @MessagePattern({ cmd: 'support_db_health' })
  async checkDatabase() {
    const conversations =
      await this.prisma.conversation.count();

    const messages =
      await this.prisma.message.count();

    return {
      service: 'support-service',
      database: 'localeats_support',
      status: 'connected',
      conversationCount: conversations,
      messageCount: messages,
    };
  }
}