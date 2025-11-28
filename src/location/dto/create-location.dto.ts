import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  cost: number;

  @IsNumber()
  owner: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  favCharacters?: number[];
}
