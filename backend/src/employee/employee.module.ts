import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './entities/employee.entity';
import { User } from '../users/entities/user.entity';
import { PrivilegeModule } from '../privilege/privilege.module';
import { BonusService } from '../financials/bonus.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, User]),
    PrivilegeModule, // Import the PrivilegeModule
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService,BonusService],
  exports: [EmployeeService, BonusService, TypeOrmModule], // Export TypeOrmModule
})
export class EmployeeModule {}