import { IsEmail, IsOptional, IsNumber, MaxLength, IsBoolean } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  userId?: number;

  @IsOptional()
  privId?: number;

  @IsOptional()
  @IsNumber()
  sal?: number;

  @IsOptional()
  @MaxLength(255)
  role?: string;

  @IsOptional()
  @IsBoolean()
  block?: boolean;
}