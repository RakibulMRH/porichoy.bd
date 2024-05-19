import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: string;

  @Column()
  adminId: string;

  @Column()
  message: string;

  @Column()
  timestamp: Date;

  @Column({ default: false })
  blocked: boolean;
}