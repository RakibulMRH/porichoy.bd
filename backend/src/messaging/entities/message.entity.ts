import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('Message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  message: string;

  @Column({ nullable: true, default: false })
  status: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn({ name: 'userId' })
  user: User;
}