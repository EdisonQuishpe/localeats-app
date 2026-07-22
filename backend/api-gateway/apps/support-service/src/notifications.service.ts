import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  create(data: {
    type: string;
    title: string;
    body: string;
    link?: string;
    userId: number;
  }) {
    return this.prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        body: data.body,
        link: data.link || null,
        userId: Number(data.userId),
      },
    });
  }

  async markAllRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { message: 'Notificaciones marcadas como leídas' };
  }
}
