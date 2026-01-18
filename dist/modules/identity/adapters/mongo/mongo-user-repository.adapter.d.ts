import { UserRepositoryPort } from '../../core/application/ports/user-repository.port';
import { User } from '../../core/domain/user.entity';
export declare class MongoUserRepositoryAdapter implements UserRepositoryPort {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
}
