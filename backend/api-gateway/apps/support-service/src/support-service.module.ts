import { Module } from '@nestjs/common';
import { SupportServiceController } from './support-service.controller';
import { PrismaService } from './prisma.service';
import { SupportService } from './support.service';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [SupportServiceController],
  providers: [PrismaService, SupportService, NotificationsService],
})
export class SupportServiceModule {}