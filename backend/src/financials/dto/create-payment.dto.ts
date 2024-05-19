import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @MaxLength(255)
  pname: string;

  @IsNotEmpty()
  pamount: number;
}