import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSession } from './entities/userSession.entity';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { BlacklistedTokenModule } from 'src/blacklisted-token/blacklisted-token.module';
import { Tenant } from './entities/tenant.enitity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSession,Tenant ]), BlacklistedTokenModule],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [UserController], 
})
export class UsersModule {}