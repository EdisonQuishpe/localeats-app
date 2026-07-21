import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [AuthServiceController],
  providers: [PrismaService],
})
export class AuthServiceModule {}