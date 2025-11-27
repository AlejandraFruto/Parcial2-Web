import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  name: string;

  @IsNumber()
  salary: number;

  @IsBoolean()
  employee: boolean;

  @IsOptional()
  @IsNumber()
  property?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  favPlaces?: number[];
}
