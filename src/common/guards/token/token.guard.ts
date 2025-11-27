import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTokenService } from '../../../api-token/api-token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly apiTokenService: ApiTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const tokenHeader = request.headers['api-token'];
    const tokenStr = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

    if (!tokenStr) {
      throw new UnauthorizedException('Token no enviado');
    }

    try {
      const token = await this.apiTokenService.findByToken(tokenStr);

      if (!token.active || token.reqLeft <= 0) {
        throw new UnauthorizedException('Token expirado o inactivo');
      }

      await this.apiTokenService.reduce(token.id);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }
}
