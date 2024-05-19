import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { FinancialsService } from './financials.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity'; // Import Payment entity

@Controller('financials')
export class FinancialsController {
  constructor(private readonly financialsService: FinancialsService) {}

  @Post('payment')
  createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.financialsService.createPayment(createPaymentDto);
  }
  @Post('employee/:empId/salary/:salary')
  editEmployeeSalary(
    @Param('empId') empId: number,
    @Param('salary') salary: number,
  ): Promise<void> {
    return this.financialsService.editEmployeeSalary(empId, salary);
  }

  @Post('employee/:empId/bonus/:bonus')
  addBonus(
    @Param('empId') empId: number,
    @Param('bonus') bonus: number,
  ): Promise<void> {
    return this.financialsService.addBonus(empId, bonus);
  }

  @Get('total-payments')
  getTotalPayments(): Promise<number> {
    return this.financialsService.getTotalPayments();
  }

  @Post('employee/:empId/remove-bonus')
async removeBonus(@Param('empId') empId: number): Promise<void> {
  return this.financialsService.removeBonus(empId);
}

@Get('all-payments')
getAllPayments(): Promise<Payment[]> {
  return this.financialsService.getAllPayments();
}
}