import {
  IsNumber,
  IsOptional,
  Min,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateApiTokenDto {
  @IsString()
  token: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  reqLeft?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
