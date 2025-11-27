import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiToken } from '../../../api-token/entities/api-token.entity';
import { Request } from 'express';
import { ApiTokenService } from '../../../api-token/api-token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @InjectRepository(ApiToken)
    private readonly tokenRepository: Repository<ApiToken>,

    private readonly apiTokenService: ApiTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const tokenHeader = request.headers['api-token'];
    const tokenStr = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

    if (!tokenStr) {
      throw new UnauthorizedException('Token no enviado');
    }

    // Buscar token en BD (por string)
    const token = await this.tokenRepository.findOne({
      where: { token: tokenStr },
    });

    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    if (!token.active || token.reqLeft <= 0) {
      throw new UnauthorizedException('Token expirado o inactivo');
    }

    try {
      await this.apiTokenService.reduce(token.id);
    } catch {
      throw new UnauthorizedException('Token expirado o inactivo');
    }

    return true;
  }
}
