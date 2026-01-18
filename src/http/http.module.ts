import { Module } from '@nestjs/common';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { QuestionsController } from './controllers/questions.controller';
import { AuthController } from './controllers/auth.controller';
import { QuestionsModule } from '../modules/questions/questions.module';
import { IdentityModule } from '../modules/identity/identity.module';

@Module({
  imports: [QuestionsModule, IdentityModule],
  controllers: [HealthcheckController, QuestionsController, AuthController],
})
export class HttpModule {}
