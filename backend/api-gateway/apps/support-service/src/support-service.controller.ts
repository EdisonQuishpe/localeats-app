import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { SupportService } from './support.service';

@Controller()
export class SupportServiceController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supportService: SupportService,
  ) {}

  @MessagePattern({ cmd: 'support_ping' })
  ping() {
    return {
      service: 'support-service',
      status: 'ok',
    };
  }

  @MessagePattern({ cmd: 'support_db_health' })
  async checkDatabase() {
    const conversationCount =
      await this.prisma.conversation.count();

    const messageCount =
      await this.prisma.message.count();

    return {
      service: 'support-service',
      database: 'localeats_support',
      status: 'connected',
      conversationCount,
      messageCount,
    };
  }

  @MessagePattern({ cmd: 'conversations_find_all' })
  findAllConversations() {
    return this.supportService.findAllConversations();
  }

  @MessagePattern({ cmd: 'conversations_find_one' })
  findConversation(@Payload() id: number) {
    return this.supportService.findConversation(Number(id));
  }

  @MessagePattern({ cmd: 'conversations_create' })
  createConversation(
    @Payload()
    data: {
      subject: string;
      userId?: number;
    },
  ) {
    return this.supportService.createConversation(data);
  }

  @MessagePattern({ cmd: 'messages_create' })
  createMessage(
    @Payload()
    data: {
      content: string;
      senderRole: string;
      conversationId: number;
      userId?: number;
    },
  ) {
    return this.supportService.createMessage(data);
  }

  @MessagePattern({ cmd: 'conversations_close' })
  closeConversation(@Payload() id: number) {
    return this.supportService.closeConversation(Number(id));
  }
}