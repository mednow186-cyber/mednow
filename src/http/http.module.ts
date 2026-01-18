import { Module } from '@nestjs/common';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { QuestionsController } from './controllers/questions.controller';
import { QuestionsModule } from '../modules/questions/questions.module';

@Module({
  imports: [QuestionsModule],
  controllers: [HealthcheckController, QuestionsController],
})
export class HttpModule {}
