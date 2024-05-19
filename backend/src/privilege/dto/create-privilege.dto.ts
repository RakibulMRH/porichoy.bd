import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePrivilegeDto {
  @IsNotEmpty()
  @MaxLength(255)
  privName: string;
}