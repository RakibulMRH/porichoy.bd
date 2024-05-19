import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateAdDto {
  @IsNotEmpty()
  @IsString()
  adName: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  video_length?: number;

  @IsNotEmpty() 
  @IsString()
  image: string; 

  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @IsNotEmpty()
  @IsNumber()
  tenantId: number;

  @IsNotEmpty()
  @IsString()
  fileName: string;
  
}