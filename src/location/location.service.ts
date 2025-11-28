import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm';
import { Location } from './entities/location.entity';
import { Character } from '../character/entities/character.entity';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,

    @InjectRepository(Character)
    private readonly characterRepo: Repository<Character>,
  ) {}

  async create(dto: CreateLocationDto) {
    const location = this.locationRepo.create({
      name: dto.name,
      type: dto.type,
      cost: dto.cost,
    });

    if (dto.owner) {
      const owner = await this.characterRepo.findOne({
        where: { id: dto.owner },
        relations: ['property'],
      });

      if (!owner) throw new NotFoundException('El dueño no existe');
      if (owner.property)
        throw new BadRequestException('Este personaje ya posee una propiedad');

      location.owner = owner;
    }

    if (dto.favCharacters?.length) {
      const chars = await this.characterRepo.find({
        where: { id: In(dto.favCharacters) },
      });

      if (chars.length !== dto.favCharacters.length)
        throw new NotFoundException(
          'Uno o más personajes favoritos no existen',
        );

      location.favCharacters = chars;
    }

    const saved = await this.locationRepo.save(location);

    return {
      id: saved.id,
      name: saved.name,
      type: saved.type,
      cost: saved.cost,
      owner: saved.owner?.id ?? null,
      favCharacters: saved.favCharacters?.map((c) => c.id) ?? [],
    };
  }

  async findAllWithFavVisitors() {
    return this.locationRepo.find({
      relations: ['favCharacters', 'owner'],
    });
  }
}
