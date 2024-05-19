import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivilegeDto } from './create-privilege.dto';

export class UpdatePrivilegeDto extends PartialType(CreatePrivilegeDto) {
  privName?: string;
  // Add any other properties you want to update here
}