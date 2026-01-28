import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from './http/http.module';
import { IdentityModule } from './modules/identity/identity.module';
import { QuestionsModule } from './modules/questions/questions.module';

function getQuestionsDbUri(): string {
  const baseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const uriWithoutDb = baseUri.replace(/\/[^/]*$/, '');
  return `${uriWithoutDb}/questions_db`;
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/questions'),
    MongooseModule.forRoot(getQuestionsDbUri(), {
      connectionName: 'questions_db',
    }),
    HttpModule,
    IdentityModule,
    QuestionsModule,
  ],
})
export class AppModule {}
