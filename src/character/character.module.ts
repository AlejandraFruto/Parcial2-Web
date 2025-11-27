import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Character } from './entities/character.entity';
import { Location } from '../location/entities/location.entity';

import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { ApiTokenModule } from '../api-token/api-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Location]), ApiTokenModule],
  controllers: [CharacterController],
  providers: [CharacterService, ApiTokenModule],
})
export class CharacterModule {}
