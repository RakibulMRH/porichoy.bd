import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { Privilege } from '../privilege/entities/privilege.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Privilege)
    private privilegeRepository: Repository<Privilege>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create();
    employee.name = createEmployeeDto.name;
    employee.sal = createEmployeeDto.sal;
    employee.email = createEmployeeDto.email;
    employee.roleBlock = createEmployeeDto.roleBlock;
    employee.role = createEmployeeDto.role;
    employee.block = createEmployeeDto.block;

    if (createEmployeeDto.privId) {
      const options: FindOneOptions<Privilege> = { where: { privId: createEmployeeDto.privId } };
      const privilege = await this.privilegeRepository.findOne(options);
      employee.privilege = privilege;
      employee.privName = privilege.privName;
    }

    return this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: ['privilege'] });
  }

 

  async update(empId: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(empId);
    employee.name = updateEmployeeDto.name ?? employee.name;
    employee.sal = updateEmployeeDto.sal ?? employee.sal;
    employee.email = updateEmployeeDto.email ?? employee.email;
    employee.role = updateEmployeeDto.role ?? employee.role;
    employee.block = updateEmployeeDto.block ?? employee.block;
  
    if (updateEmployeeDto.privId) {
      const options: FindOneOptions<Privilege> = { where: { privId: updateEmployeeDto.privId } };
      const privilege = await this.privilegeRepository.findOne(options);
      employee.privilege = privilege;
      employee.privName = privilege.privName;
    }
  
    return this.employeeRepository.save(employee);
  }

  async remove(empId: number): Promise<void> {
    await this.employeeRepository.delete(empId);
  }

  async assignPrivilegeToEmployee(empId: number, privId: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { empId } });
    const options: FindOneOptions<Privilege> = { where: { privId } };
    const privilege = await this.privilegeRepository.findOne(options);

    if (!employee || !privilege) {
      throw new Error('Employee or Privilege not found');
    }

    employee.privilege = privilege;
    employee.privId = privId;
    employee.privName = privilege.privName;

    return this.employeeRepository.save(employee);
  }

  async addBonus(empId: number, bonus: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { empId } });

    if (!employee) {
      throw new Error('Employee not found');
    }

    employee.bonus = bonus;
    return this.employeeRepository.save(employee);
  }

  async blockEmployee(empId: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { empId } });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Update the database value of the roleBlock column
    await this.employeeRepository.update(empId, { roleBlock: true });

    // Refresh the employee object to reflect the changes
    const updatedEmployee = await this.employeeRepository.findOne({ where: { empId } });

    return updatedEmployee;
  }

  
  async findOne(empId: number): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: { empId },
      relations: ['privilege'], // Remove 'privileges'
    });
  }

  async removeBonus(empId: number): Promise<Employee> {
    const employee = await this.findOne(empId);
  
    if (!employee) {
      throw new Error('Employee not found');
    }
  
    employee.bonus = 0; // Set the bonus to 0 to remove it
    return this.employeeRepository.save(employee);
  }
  

}


