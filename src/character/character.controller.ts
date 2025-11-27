import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { TokenGuard } from '../common/guards/token/token.guard';

@UseGuards(TokenGuard)
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  create(@Body() dto: CreateCharacterDto) {
    return this.characterService.create(dto);
  }

  @Patch(':id/favorites/:locationId')
  addFavorite(
    @Param('id') id: number,
    @Param('locationId') locationId: number,
  ) {
    return this.characterService.addFavorite(id, locationId);
  }

  @Get(':id/taxes')
  taxes(@Param('id') id: number) {
    return this.characterService.calculateTaxes(id);
  }
}
