import { Result } from '../../../../../building-blocks/result/result';

export class HelloWorldUseCase {
  execute(): Result<string> {
    return Result.ok('Hello World');
  }
}
