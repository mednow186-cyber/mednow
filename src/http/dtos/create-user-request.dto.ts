import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'Email do novo usuário',
    example: 'novo.usuario@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha do novo usuário',
    example: 'senha123',
    minLength: 6,
  })
  password: string;
}
