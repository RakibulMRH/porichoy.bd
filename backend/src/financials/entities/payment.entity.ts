import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  payId: number;

  @Column({ length: 255 })
  pname: string;

  @Column('decimal', { precision: 10, scale: 2 })
  pamount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}