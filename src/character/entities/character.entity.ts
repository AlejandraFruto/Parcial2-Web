import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Location } from '../../location/entities/location.entity';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'int' })
  salary: number;

  @Column({ type: 'boolean' })
  employee: boolean;

  @OneToOne(() => Location, (location) => location.owner, { nullable: true })
  @JoinColumn()
  property: Location;

  @ManyToMany(() => Location, (location) => location.favCharacters)
  @JoinTable()
  favPlaces: Location[];
}
