import { Module } from '@nestjs/common';
import { AdsManagementService } from './ad-management.services';
import { AdsManagementController } from './ad-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from '../ads/entities/ads.entity';
import { Tenant } from '../users/entities/tenant.enitity';
import { SubscriptionPlan } from '../subscription-plan/entities/subscriptionPlan.entity';
import { UsersService } from '../users/users.service';
import { AdsService } from '../ads/ads.service';
import { UsersModule } from '../users/users.module'; // Import the UsersModule
import { SubscriptionModule } from '../subscription/subscription.module'; // Import the SubscriptionModule, SubscriptionService
import { SubscriptionService } from '../subscription/subscription.service'; // Import the SubscriptionModule, SubscriptionService
import { Subscription } from '../subscription/entities/subscription.entity';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';  

@Module({
  imports: [TypeOrmModule.forFeature([Ad, Tenant,Subscription,SubscriptionPlan]), UsersModule,SubscriptionModule], // Add UsersModule to the imports array
  providers: [AdsManagementService, UsersService, AdsService,SubscriptionService,SubscriptionPlanService],
  controllers: [AdsManagementController],
  exports: [AdsManagementService, UsersService, AdsService,SubscriptionPlanService]
})
export class AdsManagementModule {}