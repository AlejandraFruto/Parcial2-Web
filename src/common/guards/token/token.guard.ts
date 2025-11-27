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

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @InjectRepository(ApiToken)
    private readonly tokenRepository: Repository<ApiToken>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const tokenHeader = request.headers['x-api-token'];
    const tokenHeaderStr = Array.isArray(tokenHeader)
      ? tokenHeader[0]
      : tokenHeader;
    if (!tokenHeaderStr) {
      throw new UnauthorizedException('Token no enviado');
    }

    const token = await this.tokenRepository.findOne({
      where: { token: tokenHeaderStr },
    });

    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    if (!token.active || token.reqLeft <= 0) {
      throw new UnauthorizedException('Token expirado o inactivo');
    }

    token.reqLeft -= 1;
    if (token.reqLeft === 0) token.active = false;
    await this.tokenRepository.save(token);

    return true;
  }
}
