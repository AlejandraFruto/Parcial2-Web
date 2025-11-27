import { IsNumber, IsOptional, Min, IsString } from 'class-validator';

export class CreateApiTokenDto {
  @IsString()
  token: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  reqLeft?: number;
}
