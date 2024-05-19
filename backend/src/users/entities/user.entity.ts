//user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserSession } from './userSession.entity';
import { Tenant } from './tenant.enitity';
import { Subscription } from '../../subscription/entities/subscription.entity';  
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Reply } from '../../feedback/entities/reply.entity';
import { Consultation } from '../../consultation/entities/consultation.entity';
import { ConsultationSlot } from '../../consultation/entities/consultationSlot.entity';
import { Ad } from '../../ads/entities/ads.entity';
import { Message } from '../../messaging/entities/message.entity'

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  tenantId: number;

  @OneToMany(() => UserSession, userSession => userSession.user)
  userSessions: UserSession[];
  
  @ManyToOne(() => Tenant, tenant => tenant.users)
  @JoinColumn({ name: 'tenantId' }) // Add this line
  tenant: Tenant;

  @OneToMany(() => Subscription, subscription => subscription.user)  
  subscriptions: Subscription[]; 

  @OneToMany(() => Feedback, feedback => feedback.adExpert)
  feedbackReceived: Feedback[];

  @OneToMany(() => Feedback, feedback => feedback.client)
  feedbackGiven: Feedback[];

  @OneToMany(() => Reply, reply => reply.user)
  replies: Reply[];

  @OneToMany(() => Consultation, (consultation) => consultation.client)
  consultationsBooked: Consultation[];

  @OneToMany(() => Consultation, (consultation) => consultation.adExpert)
  consultationsHosted: Consultation[];

  @OneToMany(() => ConsultationSlot, (slot) => slot.adExpert)
  consultationSlots: ConsultationSlot[];

  @OneToMany(() => Ad, ad => ad.client)
  adsCreated: Ad[];

  @OneToMany(() => Message, message => message.user)
  messages: Message[];

}

export enum UserType {
  Admin = 'admin',
  Client = 'client',
  AdExpert = 'adExpert', 
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);