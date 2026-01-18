import * as path from 'path';
import { ImportAnalyzer } from './import-analyzer';

describe('Regra 1: Domínio é puro', () => {
  const domainPattern = /src\/modules\/[^/]+\/core\/domain/;
  const projectRoot = path.join(__dirname, '../..');

  const forbiddenPatterns = [
    '@nestjs/',
    'src/http/',
    'src/infra/',
    'src/modules/',
    // Bibliotecas de banco comuns
    'mongodb',
    'mongoose',
    '@supabase/',
    'typeorm',
    'prisma',
    'sequelize',
    'pg',
    'mysql2',
    // SDKs e frameworks comuns
    'express',
    'fastify',
    'koa',
    'aws-sdk',
    '@aws-sdk/',
  ];

  it('deve falhar se arquivos de domínio importarem dependências proibidas', () => {
    const domainFiles = ImportAnalyzer.findTypeScriptFiles(
      path.join(projectRoot, 'src/modules'),
    ).filter((file) => domainPattern.test(ImportAnalyzer.normalizePath(file)));

    const violations: Array<{
      file: string;
      forbiddenImports: string[];
    }> = [];

    for (const file of domainFiles) {
      const imports = ImportAnalyzer.extractImports(file);
      const forbiddenImports =
        ImportAnalyzer.checkForbiddenImports(imports, forbiddenPatterns);

      // Permitir imports relativos dentro do próprio domínio
      const allowedRelativeImports = forbiddenImports.filter((imp) => {
        const normalizedFile = ImportAnalyzer.normalizePath(file);
        const isRelativeImport = imp.startsWith('./') || imp.startsWith('../');

        if (isRelativeImport) {
          // Verifica se o import relativo está dentro do mesmo domínio
          const fileDir = path.dirname(normalizedFile);
          const importPath = path.resolve(fileDir, imp).replace(/\\/g, '/');
          return domainPattern.test(importPath);
        }

        // Permitir imports de building-blocks (value-objects, errors básicos)
        if (imp.startsWith('src/building-blocks/')) {
          return true;
        }

        return false;
      });

      const actualViolations = forbiddenImports.filter(
        (imp) => !allowedRelativeImports.includes(imp),
      );

      // Filtrar imports de outros módulos que são do domínio (permitidos)
      const finalViolations = actualViolations.filter((imp) => {
        // Se o import é de outro módulo/core/domain, permitir
        if (imp.startsWith('src/modules/')) {
          const isFromOtherDomain = /src\/modules\/[^/]+\/core\/domain/.test(
            imp,
          );
          if (isFromOtherDomain) {
            return false;
          }
        }
        return true;
      });

      if (finalViolations.length > 0) {
        violations.push({
          file: path.relative(projectRoot, file),
          forbiddenImports: finalViolations,
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
        `🚫 VIOLAÇÃO DE ARQUITETURA: Domínio não pode importar dependências externas!\n${violationMessages}\n\n` +
          'O domínio deve ser puro e não pode importar:\n' +
          '- @nestjs/*\n' +
          '- src/http/*\n' +
          '- src/infra/*\n' +
          '- src/modules/**/adapters/*\n' +
          '- Bibliotecas de banco, SDKs ou frameworks',
      );
    }

    expect(violations).toHaveLength(0);
  });
});
