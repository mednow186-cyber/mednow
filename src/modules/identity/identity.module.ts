import { Module } from '@nestjs/common';
import { HelloWorldUseCase } from './core/application/use-cases/hello-world.use-case';
import { LoginUseCase } from './core/application/use-cases/login.use-case';
import { CreateUserUseCase } from './core/application/use-cases/create-user.use-case';
import { RefreshTokenUseCase } from './core/application/use-cases/refresh-token.use-case';
import { SupabaseAuthAdapter } from './adapters/supabase/supabase-auth.adapter';
import { MongoUserRepositoryAdapter } from './adapters/mongo/mongo-user-repository.adapter';
import { AuthProviderPort } from './core/application/ports/auth-provider.port';
import { UserRepositoryPort } from './core/application/ports/user-repository.port';

@Module({
  providers: [
    HelloWorldUseCase,
    LoginUseCase,
    CreateUserUseCase,
    RefreshTokenUseCase,
    {
      provide: 'AuthProviderPort',
      useClass: SupabaseAuthAdapter,
    },
    {
      provide: 'UserRepositoryPort',
      useClass: MongoUserRepositoryAdapter,
    },
  ],
  exports: [HelloWorldUseCase, LoginUseCase, CreateUserUseCase, RefreshTokenUseCase],
})
export class IdentityModule {}
