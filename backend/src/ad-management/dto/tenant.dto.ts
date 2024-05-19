import { IsString, IsOptional } from 'class-validator';

export class TenantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsString()
  @IsOptional()
  subscriptionPlan?: string;

  @IsString()
  @IsOptional()
  costPerSecond?: string;
}