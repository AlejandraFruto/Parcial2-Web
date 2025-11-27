import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiToken } from './entities/api-token.entity';
import { CreateApiTokenDto } from './dto/create-api-token.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class ApiTokenService {
  constructor(
    @InjectRepository(ApiToken)
    private readonly tokenRepository: Repository<ApiToken>,
    private readonly apiTokenService: ApiTokenService,
  ) {}

  async create(dto: CreateApiTokenDto) {
    const randomToken = randomBytes(32).toString('hex');

    const token = this.tokenRepository.create({
      token: randomToken,
      reqLeft: dto.reqLeft ?? 10,
      active: true,
    });

    return this.tokenRepository.save(token);
  }

  async isValid(id: string) {
    const token = await this.tokenRepository.findOne({ where: { id } });
    if (!token) throw new NotFoundException('Token no existe');

    return token.active && token.reqLeft > 0;
  }

  async reduce(id: string) {
    const token = await this.tokenRepository.findOne({ where: { id } });
    if (!token) throw new NotFoundException('Token no existe');

    if (!token.active || token.reqLeft <= 0) {
      throw new BadRequestException('El token no tiene peticiones disponibles');
    }

    try {
      await this.apiTokenService.reduce(token.id);
    } catch {
      throw new UnauthorizedException('Token expirado o inactivo');
    }

    return true;
  }
}
