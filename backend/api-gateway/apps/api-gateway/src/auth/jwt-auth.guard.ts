import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtPayload } from './jwt-payload.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & { user?: JwtPayload }
    >();
    const authorization = request.headers['authorization'];

    if (!authorization || Array.isArray(authorization)) {
      throw new UnauthorizedException('Debe enviar un token Bearer');
    }

    const match = authorization.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      throw new UnauthorizedException('Debe enviar un token Bearer');
    }

    try {
      const payload = await firstValueFrom(
        this.authClient.send<JwtPayload>(
          { cmd: 'auth_validate_token' },
          match[1].trim(),
        ),
      );

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}