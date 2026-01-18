import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { IdentityModule } from './modules/identity/identity.module';

@Module({
  imports: [HttpModule, IdentityModule],
})
export class AppModule {}
