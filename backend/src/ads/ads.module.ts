import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { Ad } from './entities/ads.entity';
import { BlacklistedTokenModule } from 'src/blacklisted-token/blacklisted-token.module';
import { Subscription } from '../subscription/entities/subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { Tenant } from 'src/users/entities/tenant.enitity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, User, Tenant,  Subscription]), BlacklistedTokenModule],
  providers: [AdsService],
  controllers: [AdsController]
})
export class AdsModule {}