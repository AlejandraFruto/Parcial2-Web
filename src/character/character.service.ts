import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm';
import { Character } from './entities/character.entity';
import { Location } from '../location/entities/location.entity';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepo: Repository<Character>,

    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) {}

  async create(dto: CreateCharacterDto) {
    const character = this.characterRepo.create({
      name: dto.name,
      salary: dto.salary,
      employee: dto.employee,
    });

    if (dto.property) {
      const property = await this.locationRepo.findOne({
        where: { id: dto.property },
        relations: ['owner'],
      });

      if (!property) throw new NotFoundException('La propiedad no existe');
      if (property.owner)
        throw new BadRequestException('Esta locación ya tiene dueño');

      character.property = property;
    }

    if (dto.favPlaces?.length) {
      const places = await this.locationRepo.find({
        where: { id: In(dto.favPlaces) },
      });

      if (places.length !== dto.favPlaces.length)
        throw new NotFoundException('Una locación de favoritos no existe');

      character.favPlaces = places;
    }

    const saved = await this.characterRepo.save(character);

    return {
      id: saved.id,
      name: saved.name,
      salary: saved.salary,
      employee: saved.employee,
      property: saved.property?.id ?? null,
      favPlaces: saved.favPlaces?.map((p) => p.id) ?? [],
    };
  }

  async addFavorite(characterId: number, locationId: number) {
    const character = await this.characterRepo.findOne({
      where: { id: characterId },
      relations: ['favPlaces'],
    });
    if (!character) throw new NotFoundException('Personaje no existe');

    const location = await this.locationRepo.findOne({
      where: { id: locationId },
    });
    if (!location) throw new NotFoundException('La locación no existe');

    character.favPlaces.push(location);

    return this.characterRepo.save(character);
  }

  async calculateTaxes(id: number) {
    const character = await this.characterRepo.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!character) throw new NotFoundException('Personaje no existe');

    if (!character.property) {
      return { taxDebt: 0 };
    }

    const coef = character.employee ? 0.08 : 0.03;
    const locationCost = character.property.cost;

    const tax = locationCost * (1 + coef);

    return { taxDebt: tax };
  }
}
