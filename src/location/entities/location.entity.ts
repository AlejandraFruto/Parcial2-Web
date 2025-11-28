import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { Character } from '../../character/entities/character.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'int' })
  cost: number;

  @OneToOne(() => Character, (char) => char.property)
  owner: Character;

  @ManyToMany(() => Character, (char) => char.favPlaces)
  favCharacters: Character[];
}
