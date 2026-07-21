import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller()
export class AuthServiceController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

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

  @MessagePattern({ cmd: 'auth_register' })
  register(@Payload() data: RegisterUserDto) {
    return this.authService.register(data);
  }
}