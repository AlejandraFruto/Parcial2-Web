import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ApiTokenService } from './api-token.service';
import { CreateApiTokenDto } from './dto/create-api-token.dto';

@Controller('token')
export class ApiTokenController {
  constructor(private readonly apiTokenService: ApiTokenService) {}

  @Post()
  create(@Body() dto: CreateApiTokenDto) {
    return this.apiTokenService.create(dto);
  }

  @Get(':idToken')
  isValid(@Param('idToken') id: string) {
    return this.apiTokenService.isValid(id);
  }

  @Patch('reduce/:idToken')
  reduce(@Param('idToken') id: string) {
    return this.apiTokenService.reduce(id);
  }
}
