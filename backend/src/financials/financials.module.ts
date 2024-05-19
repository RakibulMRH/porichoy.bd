import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialsService } from './financials.service';
import { FinancialsController } from './financials.controller';
import { Payment } from './entities/payment.entity';
import { EmployeeModule } from '../employee/employee.module';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/entities/employee.entity';
import { BonusService } from '../financials/bonus.service';
import { PrivilegeModule } from '../privilege/privilege.module'; // Import PrivilegeModule 

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    EmployeeModule, // Import EmployeeModule
    PrivilegeModule 
  ],
  controllers: [FinancialsController],
  providers: [FinancialsService, EmployeeService,BonusService],
  exports: [TypeOrmModule],
})
export class FinancialsModule {}