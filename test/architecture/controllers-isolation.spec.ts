import * as path from 'path';
import { ImportAnalyzer } from './import-analyzer';

describe('Regra 2: Controllers não acessam infra', () => {
  const projectRoot = path.join(__dirname, '../..');
  const controllersDir = path.join(projectRoot, 'src/http/controllers');

  const forbiddenPatterns = [
    // Adaptadores
    'src/modules/',
    // Infraestrutura
    'src/infra/',
    // Repositórios específicos (nomes comuns)
    'repository',
    'Repository',
    // Bibliotecas de banco
    'mongodb',
    'mongoose',
    '@supabase/',
    'typeorm',
    'prisma',
    'sequelize',
    'pg',
    'mysql2',
  ];

  it('deve falhar se controllers importarem adapters, infra ou repositórios', () => {
    const controllerFiles = ImportAnalyzer.findTypeScriptFiles(controllersDir);

    const violations: Array<{
      file: string;
      forbiddenImports: string[];
    }> = [];

    for (const file of controllerFiles) {
      const imports = ImportAnalyzer.extractImports(file);
      const forbiddenImports =
        ImportAnalyzer.checkForbiddenImports(imports, forbiddenPatterns);

      // Filtrar imports permitidos:
      // - @nestjs/common (permitido para decorators)
      // - Casos de uso
      // - DTOs
      // - Building-blocks
      const filteredViolations = forbiddenImports.filter((imp) => {
        // Permitir @nestjs/common para decorators
        if (imp === '@nestjs/common' || imp.startsWith('@nestjs/common/')) {
          return false;
        }

        // Verificar se é import de adapter (proibido)
        if (imp.includes('/adapters/')) {
          return true;
        }

        // Verificar se é import de infra (proibido)
        if (imp.startsWith('src/infra/')) {
          return true;
        }

        // Verificar se é repositório direto (proibido)
        if (
          /repository/i.test(imp) &&
          !imp.includes('/use-cases/') &&
          !imp.includes('/ports/')
        ) {
          // Permitir se for um port (interface), não uma implementação
          const isPort = imp.includes('/ports/');
          return !isPort;
        }

        // Permitir casos de uso
        if (imp.includes('/use-cases/')) {
          return false;
        }

        // Permitir building-blocks
        if (imp.startsWith('src/building-blocks/')) {
          return false;
        }

        return true;
      });

      if (filteredViolations.length > 0) {
        violations.push({
          file: path.relative(projectRoot, file),
          forbiddenImports: filteredViolations,
        });
      }
    }

    if (violations.length > 0) {
      const violationMessages = violations
        .map(
          (v) =>
            `\n  ❌ ${v.file}\n     Imports proibidos: ${v.forbiddenImports.join(', ')}`,
        )
        .join('\n');

      throw new Error(
        `🚫 VIOLAÇÃO DE ARQUITETURA: Controllers não podem acessar infraestrutura!\n${violationMessages}\n\n` +
          'Controllers só podem:\n' +
          '- Chamar casos de uso (use-cases)\n' +
          '- Usar DTOs\n' +
          '- Usar building-blocks\n\n' +
          'Controllers NÃO podem:\n' +
          '- Importar adapters\n' +
          '- Importar infra\n' +
          '- Importar implementações de repositório',
      );
    }

    expect(violations).toHaveLength(0);
  });
});
