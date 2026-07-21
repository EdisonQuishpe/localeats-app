import { Module } from '@nestjs/common';

import { SupportServiceController } from './support-service.controller';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [SupportServiceController],
  providers: [PrismaService],
})
export class SupportServiceModule {}