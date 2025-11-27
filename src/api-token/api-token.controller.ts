import { Controller, Post, Body } from '@nestjs/common';
import { ApiTokenService } from './api-token.service';
import { CreateApiTokenDto } from './dto/create-api-token.dto';

@Controller('api-token')
export class ApiTokenController {
  constructor(private readonly apiTokenService: ApiTokenService) {}

  @Post()
  create(@Body() dto: CreateApiTokenDto) {
    return this.apiTokenService.create(dto);
  }
}
