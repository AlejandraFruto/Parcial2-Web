import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Location } from './entities/location.entity';
import { Character } from '../character/entities/character.entity';

import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { ApiTokenModule } from '../api-token/api-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Character]), ApiTokenModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
