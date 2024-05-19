import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity'; 


@Injectable()
export class BonusService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>, 
  ) {}

  async addBonus(empId: number, bonus: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { empId } });
    employee.bonus = (employee.bonus || 0) + bonus;
    const updatedEmployee = await this.employeeRepository.save(employee);

    // Send email notification
    await this.sendBonusEmail(updatedEmployee, bonus);

    return updatedEmployee;
  }

  private async sendBonusEmail(employee: Employee, bonus: number): Promise<void> {
    const { name, email } = employee;
   /* await this.mailerService.sendMail({
      to: email,
      subject: 'Bonus Notification',
      template: 'bonus-email',
      context: {
        name,
        bonus,
      },
    });*/
  }
}