import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { ApiTokenService } from './api-token.service';
import { CreateApiTokenDto } from './dto/create-api-token.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('token')
export class ApiTokenController {
  constructor(private readonly apiTokenService: ApiTokenService) {}

  @Post()
  create(@Body() dto: CreateApiTokenDto) {
    return this.apiTokenService.create(dto);
  }

  @Get(':idToken')
  isValid(@Param('idToken', new ParseUUIDPipe()) idToken: string) {
    return this.apiTokenService.isValid(idToken);
  }

  @Patch('reduce/:idToken')
  reduce(@Param('idToken') idToken: string) {
    return this.apiTokenService.reduce(idToken);
  }
}
