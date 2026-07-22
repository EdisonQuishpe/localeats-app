import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthServiceController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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


  @MessagePattern({ cmd: 'auth_login' })
login(@Payload() data: LoginUserDto) {
  return this.authService.login(data);
}


@MessagePattern({ cmd: 'auth_validate_token' })
validateToken(@Payload() token: string) {
  return this.authService.validateToken(token);
}

@MessagePattern({ cmd: 'auth_reset_password' })
resetPassword(@Payload() data: { email: string; newPassword: string }) {
  return this.authService.resetPassword(data);
}

@MessagePattern({ cmd: 'users_find_all' })
findAllUsers() {
  return this.usersService.findAll();
}

@MessagePattern({ cmd: 'users_update' })
updateUser(
  @Payload() payload: { id: number; data: { role?: string; isActive?: boolean } },
) {
  return this.usersService.update(Number(payload.id), payload.data);
}
}