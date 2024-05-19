import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { PrivilegeModule } from './privilege/privilege.module';
import { FinancialsModule } from './financials/financials.module'; 
import { RabbitmqModule } from './chat/rabbitmq.module';
import { RabbitmqService } from './chat/rabbitmq.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ProfileModule } from './profile/profile.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscriptionPlanModule } from './subscription-plan/subscription-plan.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ConsultationModule } from './consultation/consultation.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OpenaiModule } from './openai/openai.module';
import { BlacklistedTokenModule } from './blacklisted-token/blacklisted-token.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AdsModule} from './ads/ads.module';

import config from '../ormconfig';

@Module({
  imports: [ 
    TypeOrmModule.forRoot(config), 
    OpenaiModule,
    UsersModule,
    DashboardModule,
    AuthModule,
    ProfileModule,
    SubscriptionModule,
    SubscriptionPlanModule,
    FileUploadModule,
    FeedbackModule,
    ConsultationModule,
    BlacklistedTokenModule,
    EmployeeModule,
    PrivilegeModule,
    FinancialsModule, 
    RabbitmqModule,
    AdsModule
  ],
  controllers: [AppController],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }, AppService],
})

export class AppModule {};
/*
export class AppModule implements OnModuleInit {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async onModuleInit() {
    await this.rabbitmqService.connect();
    this.rabbitmqService.consumeMessages((message) => {
      console.log(`Received message: ${message}`);
      // Handle the received message
    });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}*/