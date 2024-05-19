import { Controller, Get, Post, Body, Patch, Param, Delete,Put } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';


@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':empId')
  findOne(@Param('empId') empId: string) {
    return this.employeeService.findOne(+empId);
  }

  @Patch(':empId')
  update(@Param('empId') empId: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+empId, updateEmployeeDto);
  }

  @Delete(':empId')
  remove(@Param('empId') empId: string) {
    return this.employeeService.remove(+empId);
  }

  @Post(':empId/privilege/:privId')
  assignPrivilegeToEmployee(
    @Param('empId') empId: string,
    @Param('privId') privId: string,
  ) {
    return this.employeeService.assignPrivilegeToEmployee(+empId, +privId);
  }

  @Post(':empId/bonus/:bonus')
  addBonus(
    @Param('empId') empId: string,
    @Param('bonus') bonus: string,
  ) {
    return this.employeeService.addBonus(+empId, +bonus);
  }

  @Put(':empId/block')
  blockEmployee(@Param('empId') empId: string) {
    return this.employeeService.blockEmployee(+empId);
  }

  // New endpoint for searching by empId
  @Get('search/:empId')
  searchByEmpId(@Param('empId') empId: number): Promise<Employee> {
    return this.employeeService.findOne(empId);
  }
}