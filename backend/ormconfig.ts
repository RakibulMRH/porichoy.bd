import { User } from './src/users/entities/user.entity';
import { UserSession } from './src/users/entities/userSession.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Tenant } from './src/users/entities/tenant.enitity';
import { Subscription } from './src/subscription/entities/subscription.entity';
import { SubscriptionPlan } from './src/subscription-plan/entities/subscriptionPlan.entity';
import { Feedback } from './src/feedback/entities/feedback.entity';
import { Reply } from './src/feedback/entities/reply.entity';
import { Consultation } from './src/consultation/entities/consultation.entity';
import { ConsultationSlot } from './src/consultation/entities/consultationSlot.entity';
import { BlacklistedToken } from 'src/blacklisted-token/entities/blacklisted-token.entity';
import { Ad } from './src/ads/entities/ads.entity';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mrh',
  entities: ["dist/**/*.entity{.ts,.js}", Tenant],
  synchronize: true,
};

export default config;