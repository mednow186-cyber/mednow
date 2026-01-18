import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from './http/http.module';
import { IdentityModule } from './modules/identity/identity.module';
import { QuestionsModule } from './modules/questions/questions.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/questions'),
    HttpModule,
    IdentityModule,
    QuestionsModule,
  ],
})
export class AppModule {}
