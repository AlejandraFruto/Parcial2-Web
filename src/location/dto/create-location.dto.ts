import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  cost: number;

  @IsOptional()
  @IsNumber()
  owner?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  favCharacters?: number[];
}
