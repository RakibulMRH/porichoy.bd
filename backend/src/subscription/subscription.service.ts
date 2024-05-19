import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Tenant } from '../users/entities/tenant.enitity';
import { SubscriptionPlan } from '../subscription-plan/entities/subscriptionPlan.entity';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { User } from '../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { MoreThan } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User) // Inject the UserRepository
    private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
  ) {}

async createSubscription(tenantId: number, planId: number, userId: number, paymentMethod: string): Promise<Subscription> {
  tenantId = Number(tenantId);
  planId = Number(planId);
  userId = Number(userId);

  // Check if the user already has an active subscription
  const existingSubscriptions = await this.subscriptionRepository
    .createQueryBuilder('subscription')
    .innerJoinAndSelect('subscription.user', 'user')
    .where('user.id = :userId', { userId })
    .andWhere('subscription.endDate > :now', { now: new Date() })
    .getMany();

  if (existingSubscriptions.length > 0) {
    throw new BadRequestException('You already have an active subscription.');
  }

  const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
  const plan = await this.planRepository.findOne({ where: { id: planId } });
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!tenant) {
    throw new Error(`Tenant with id ${tenantId} not found`);
  }

  if (!plan) {
    throw new Error(`Plan with id ${planId} not found`);
  }

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const subscription = new Subscription();
  subscription.tenant = tenant;
  subscription.plan = plan;
  subscription.user = user;
  subscription.paymentMethod = paymentMethod;
  subscription.paymentStatus = 'Paid';
  subscription.startDate = new Date();

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  subscription.endDate = endDate;

  // Update the tenantId of the user
  user.tenantId = tenantId;
  await this.userRepository.save(user);

  return this.subscriptionRepository.save(subscription);
}
  
  async updateSubscription(id: number, paymentStatus: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({ where: { id } });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.paymentStatus = paymentStatus;
    return this.subscriptionRepository.save(subscription);
  }

  async getSubscriptionByTenant(tenantId: number): Promise<Subscription> {
    return this.subscriptionRepository.findOne({ where: { tenant: { id: tenantId } } });
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionRepository.find();
  }
  private calculateEndDate(planName: string): Date 
  {
    if (planName === 'Basic') {
        return new Date(new Date().setMonth(new Date().getMonth() + 1));
      }
      if (planName === 'Pro') {
        return new Date(new Date().setMonth(new Date().getMonth() + 3));
      }
      if (planName === 'Yearly') {
        return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      }

    return new Date();
  }

  async getActiveSubscription(userId: number): Promise<Subscription> {
  const now = new Date();

  const activeSubscription = await this.subscriptionRepository
    .createQueryBuilder('subscription')
    .innerJoinAndSelect('subscription.user', 'user')
    .innerJoinAndSelect('subscription.tenant', 'tenant')
    .innerJoinAndSelect('subscription.plan', 'plan')
    .where('user.id = :userId', { userId })
    .andWhere('subscription.startDate <= :now', { now })
    .andWhere('subscription.endDate > :now', { now })
    .getOne();

  if (!activeSubscription) {
    throw new Error(`No active subscription found for user with id ${userId}`);
  }

  return activeSubscription;
}

async upgradeSubscription(id: number, planId: number): Promise<Subscription> {
  const subscription = await this.getActiveSubscription(id);

  const newPlan = await this.planRepository.findOne({ where: { id: planId } });

  if (!newPlan) {
    throw new Error(`Plan with id ${planId} not found`);
  }

  subscription.plan = newPlan;

  return this.subscriptionRepository.save(subscription);
}



}