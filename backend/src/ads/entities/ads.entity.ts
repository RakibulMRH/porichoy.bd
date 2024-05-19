import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './../../users/entities/user.entity';
import { Tenant } from './../../users/entities/tenant.enitity';

@Entity('Ads')
export class Ad {
  @PrimaryGeneratedColumn()
  adId: number;

  @Column({ nullable: false })
  adName: string; 
 
  @ManyToOne(() => User, user => user.adsCreated)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => Tenant, tenant => tenant.ads)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ nullable: false })
  location: string;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: true })
  video_length: number;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  fileName: string; 
}