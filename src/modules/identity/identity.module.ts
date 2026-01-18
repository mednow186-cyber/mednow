import { Module } from '@nestjs/common';
import { HelloWorldUseCase } from './core/application/use-cases/hello-world.use-case';
import { SupabaseAuthAdapter } from './adapters/supabase/supabase-auth.adapter';
import { MongoUserRepositoryAdapter } from './adapters/mongo/mongo-user-repository.adapter';
import { AuthProviderPort } from './core/application/ports/auth-provider.port';
import { UserRepositoryPort } from './core/application/ports/user-repository.port';

@Module({
  providers: [
    HelloWorldUseCase,
    {
      provide: 'AuthProviderPort',
      useClass: SupabaseAuthAdapter,
    },
    {
      provide: 'UserRepositoryPort',
      useClass: MongoUserRepositoryAdapter,
    },
  ],
  exports: [HelloWorldUseCase],
})
export class IdentityModule {}
