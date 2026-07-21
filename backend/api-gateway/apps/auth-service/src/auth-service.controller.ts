import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly prisma: PrismaService) {}

  @MessagePattern({ cmd: 'auth_ping' })
  ping() {
    return {
      service: 'auth-service',
      status: 'ok',
      message: 'Auth Service está funcionando',
    };
  }

  @MessagePattern({ cmd: 'auth_db_health' })
  async checkDatabase() {
    const users = await this.prisma.user.count();

    return {
      service: 'auth-service',
      database: 'localeats_auth',
      status: 'connected',
      userCount: users,
    };
  }
}