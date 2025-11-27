import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateApiTokenDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  reqLeft?: number;
}
