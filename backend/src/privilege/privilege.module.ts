import { Module } from '@nestjs/common';
import { PrivilegeService } from './privilege.service';
import { PrivilegeController } from './privilege.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Privilege } from './entities/privilege.entity';
import { PrivilegeRepository } from './privilege.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Privilege])],
  controllers: [PrivilegeController],
  providers: [PrivilegeService, PrivilegeRepository],
  exports: [TypeOrmModule],
})
export class PrivilegeModule {}