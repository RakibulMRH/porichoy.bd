import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class UpdateAdDto {
  @IsOptional()
  @IsString()
  adName?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  video_length?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}