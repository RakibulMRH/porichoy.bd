import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class FinancialsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private employeeService: EmployeeService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = new Payment();
    payment.pname = createPaymentDto.pname;
    payment.pamount = createPaymentDto.pamount;
    return this.paymentRepository.save(payment);
  }

  async editEmployeeSalary(empId: number, salary: number): Promise<void> {
    await this.employeeService.update(empId, { sal: salary });
  }

  async addBonus(empId: number, bonus: number): Promise<void> {
    await this.employeeService.addBonus(empId, bonus);
  }

  async getTotalPayments(): Promise<number> {
    const payments = await this.paymentRepository.find();
    const totalPayments = payments.reduce(
      (sum, payment) => sum + Number(payment.pamount),
      0,
    );
    return totalPayments;
}

  async removeBonus(empId: number): Promise<void> {
    await this.employeeService.removeBonus(empId);
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }
}