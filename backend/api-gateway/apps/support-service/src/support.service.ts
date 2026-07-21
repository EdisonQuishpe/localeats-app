import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  findAllConversations() {
    return this.prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findConversation(id: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    return conversation;
  }

  createConversation(data: {
    subject: string;
    userId?: number;
  }) {
    return this.prisma.conversation.create({
      data: {
        subject: data.subject.trim(),
        userId: data.userId ?? null,
      },
    });
  }

  createMessage(data: {
    content: string;
    senderRole: string;
    conversationId: number;
    userId?: number;
  }) {
    return this.prisma.message.create({
      data: {
        content: data.content.trim(),
        senderRole: data.senderRole,
        conversationId: Number(data.conversationId),
        userId: data.userId ?? null,
      },
    });
  }

  async closeConversation(id: number) {
    await this.findConversation(id);

    return this.prisma.conversation.update({
      where: { id },
      data: {
        status: 'closed',
      },
    });
  }
}