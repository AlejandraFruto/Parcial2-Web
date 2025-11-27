import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { TokenGuard } from '../common/guards/token/token.guard';

@UseGuards(TokenGuard)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }

  @Get()
  findAllWithVisitors() {
    return this.locationService.findAllWithFavVisitors();
  }
}
