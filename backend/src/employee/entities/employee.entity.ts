import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Privilege } from '../../privilege/entities/privilege.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  empId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  sal: number;

  @Column({ default: false, nullable: true })
  roleBlock: boolean;

  @Column({ nullable: true })
  privId: number;

  @ManyToOne(() => Privilege, { nullable: true })
  @JoinColumn({ name: 'privId' })
  privilege: Privilege;

  @Column({ length: 255, nullable: true })
  privName: string;

  @Column({ nullable: true })
  bonus: number;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  regDate: Date;

  @Column({ nullable: true })
  role: string;

  @Column({ default: false, nullable: true })
  block: boolean;
}