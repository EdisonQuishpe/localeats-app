import { Module } from '@nestjs/common';
import { SupportServiceController } from './support-service.controller';
import { PrismaService } from './prisma.service';
import { SupportService } from './support.service';

@Module({
  controllers: [SupportServiceController],
  providers: [PrismaService, SupportService],
})
export class SupportServiceModule {}