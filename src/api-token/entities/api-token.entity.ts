import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApiToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  token: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 10 })
  reqLeft: number;
}
