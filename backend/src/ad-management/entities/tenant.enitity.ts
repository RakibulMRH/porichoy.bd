import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OneToOne } from 'typeorm';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { SubscriptionPlan } from '../../subscription-plan/entities/subscriptionPlan.entity';
import { Ad } from '../../ads/entities/ads.entity';

@Entity('Tenant')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  domain: string;

  @Column({ nullable: false })
  subscriptionPlan: string;

  @Column({ nullable: true })
  costPerSecond: string;

  @OneToMany(() => User, user => user.tenant)
  users: User[];

  @OneToOne(() => Subscription, subscription => subscription.tenant)
  subscription: Subscription;
  
  @OneToMany(() => Ad, ad => ad.tenant)
  ads: Ad[];
 
}