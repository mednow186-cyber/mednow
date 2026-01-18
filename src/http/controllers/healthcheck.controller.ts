import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthcheckController {
  @Get()
  @ApiOperation({
    summary: 'Verificar saúde da API',
    description: 'Endpoint para verificar se a API está funcionando corretamente',
  })
  @ApiResponse({
    status: 200,
    description: 'API está funcionando',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
      },
    },
  })
  check() {
    return { status: 'ok' };
  }
}
