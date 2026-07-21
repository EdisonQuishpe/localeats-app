import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthServiceController],
  providers: [
    PrismaService,
    AuthService,
  ],
})
export class AuthServiceModule {}