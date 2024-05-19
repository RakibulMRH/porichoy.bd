import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';

@Entity()
export class Privilege {
  @PrimaryGeneratedColumn()
  privId: number;

  @Column()
  privName: string;

  @ManyToOne(() => Employee, (employee) => employee.privilege)
  employee: Employee;
}