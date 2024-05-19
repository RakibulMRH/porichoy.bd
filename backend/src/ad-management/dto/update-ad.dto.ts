import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAdDto {
  @IsString()
  @IsOptional()
  adName?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  video_length?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  fileName?: string;
}