import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
  ) {}

  async create(dto: CreateApiTokenDto) {
    const randomToken = randomBytes(32).toString('hex'); // genera token único

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

    token.reqLeft -= 1;

    if (token.reqLeft === 0) {
      token.active = false;
    }

    return this.tokenRepository.save(token);
  }
}
