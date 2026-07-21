import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'localeats-secret-development',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthServiceController],
  providers: [PrismaService, AuthService],
})
export class AuthServiceModule {}