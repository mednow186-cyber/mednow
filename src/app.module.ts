import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { IdentityModule } from './modules/identity/identity.module';
import { QuestionsModule } from './modules/questions/questions.module';

@Module({
  imports: [HttpModule, IdentityModule, QuestionsModule],
})
export class AppModule {}
