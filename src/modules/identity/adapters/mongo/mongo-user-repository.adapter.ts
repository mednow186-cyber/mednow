import { UserRepositoryPort } from '../../core/application/ports/user-repository.port';
import { User } from '../../core/domain/user.entity';

export class MongoUserRepositoryAdapter implements UserRepositoryPort {
  async findById(id: string): Promise<User | null> {
    throw new Error('Not implemented');
  }

  async findByEmail(email: string): Promise<User | null> {
    throw new Error('Not implemented');
  }

  async save(user: User): Promise<void> {
    throw new Error('Not implemented');
  }
}
