import { Controller, Post, Body, Put, Param, Delete, Get, UseGuards } from '@nestjs/common';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';
import { SubscriptionPlan } from '../subscription-plan/entities/subscriptionPlan.entity';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { UpdateSubscriptionDto } from './dto/updateSubscription.dto';
import { Subscription } from './entities/subscription.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

interface RequestWithUser extends Request {
  user: {
    id: number;
    type: string;
    // add other properties if needed
  };
}
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
//GET /subscriptions/TEANANT_ID/PLAN_ID
@Post(':userId/:tenantId/:planId')
@UseGuards(JwtAuthGuard)
async createSubscription(
  @Param('userId') userId: string,
  @Param('tenantId') tenantId: number,
  @Param('planId') planId: number,
  @Body() createSubscriptionDto: CreateSubscriptionDto,
  @Req() req: RequestWithUser,
): Promise<Subscription> {
  const user = req.user;

  if (user.id !== Number(userId)) {
    throw new UnauthorizedException(userId+'You are not authorized to perform this operation');
  }

  return this.subscriptionService.createSubscription(tenantId, planId, Number(userId), createSubscriptionDto.paymentMethod);
}

  @Put(':id')  
  @UseGuards(JwtAuthGuard)

  async updateSubscription(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.updateSubscription(id, updateSubscriptionDto.paymentStatus);
  }

  @Get(':tenantId')
  @UseGuards(JwtAuthGuard)

  async getSubscriptionByTenant(@Param('tenantId') tenantId: number): Promise<Subscription> {
    return this.subscriptionService.getSubscriptionByTenant(tenantId);
  }

@Get()
@UseGuards(JwtAuthGuard)
async getSubscriptions(@Req() req: RequestWithUser): Promise<Subscription[] | Subscription> {
  if (req.user.type === 'admin') {
    return this.subscriptionService.getAllSubscriptions();
  } else {
    return this.subscriptionService.getActiveSubscription(req.user.id);
  }
}

@Put(':planId/upgrade')
@UseGuards(JwtAuthGuard)
async upgradeSubscription( 
  @Body('planId') planId: number, @Req() req: RequestWithUser
): Promise<Subscription> {
  return this.subscriptionService.upgradeSubscription(req.user.id, planId);
}

}