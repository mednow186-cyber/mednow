import * as path from 'path';
import { ImportAnalyzer } from './import-analyzer';

describe('Regra 3: Adapters não contêm regra de negócio', () => {
  const projectRoot = path.join(__dirname, '../..');
  const adaptersPattern = /src\/modules\/[^/]+\/adapters/;

  const forbiddenPatterns = [
    // Outros adapters (não pode importar outros adapters)
    '/adapters/',
    // Controllers (não pode importar controllers)
    'src/http/controllers',
    // Lógica de domínio específica (permitir apenas tipos/interfaces)
  ];

  it('deve falhar se adapters importarem outros adapters ou controllers', () => {
    const adapterFiles = ImportAnalyzer.findTypeScriptFiles(
      path.join(projectRoot, 'src/modules'),
    ).filter((file) =>
      adaptersPattern.test(ImportAnalyzer.normalizePath(file)),
    );

    const violations: Array<{
      file: string;
      forbiddenImports: string[];
      reason: string;
    }> = [];

    for (const file of adapterFiles) {
      const imports = ImportAnalyzer.extractImports(file);
      const normalizedFile = ImportAnalyzer.normalizePath(file);

      // Extrair o módulo atual (ex: identity)
      const moduleMatch = normalizedFile.match(/modules\/([^/]+)\//);
      const currentModule = moduleMatch ? moduleMatch[1] : '';

      for (const imp of imports) {
        let violationReason = '';
        const isRelativeImport = imp.startsWith('./') || imp.startsWith('../');

        // Resolver caminho do import para verificar se leva a outro adapter
        let resolvedImportPath = imp;
        if (isRelativeImport) {
          const fileDir = path.dirname(normalizedFile);
          resolvedImportPath = path
            .resolve(projectRoot, fileDir, imp)
            .replace(/\\/g, '/');
        } else if (imp.startsWith('src/')) {
          resolvedImportPath = path
            .resolve(projectRoot, imp)
            .replace(/\\/g, '/');
        }

        // Verificar se o import leva a outro adapter (proibido)
        const leadsToAdapter = resolvedImportPath.includes('/adapters/');
        const isFromSameAdapter = normalizedFile.includes('/adapters/');

        if (leadsToAdapter && isFromSameAdapter) {
          // Verificar se não é o mesmo arquivo (auto-import)
          const normalizedResolved = ImportAnalyzer.normalizePath(
            resolvedImportPath + '.ts',
          );
          const normalizedCurrent = normalizedFile;

          if (
            !normalizedResolved.startsWith(normalizedCurrent.replace('.ts', ''))
          ) {
            // Verificar se é do mesmo módulo (mesmo assim é proibido importar outro adapter)
            const currentModuleMatch = normalizedFile.match(/modules\/([^/]+)\//);
            const resolvedModuleMatch = resolvedImportPath.match(
              /modules\/([^/]+)\//,
            );
            const currentModule = currentModuleMatch ? currentModuleMatch[1] : '';
            const resolvedModule = resolvedModuleMatch
              ? resolvedModuleMatch[1]
              : '';

            // Adapters não podem importar outros adapters, mesmo do mesmo módulo
            if (currentModule === resolvedModule || !resolvedModule) {
              violationReason = 'Adapters não podem importar outros adapters';
            }
          }
        }

        // Verificar import absoluto de adapters
        if (imp.startsWith('src/modules/') && imp.includes('/adapters/')) {
          violationReason = 'Adapters não podem importar outros adapters';
        }

        // Verificar import de controllers
        if (imp.includes('src/http/controllers')) {
          violationReason = 'Adapters não podem importar controllers';
        }

        if (violationReason) {
          const existingViolation = violations.find(
            (v) => v.file === path.relative(projectRoot, file),
          );

          if (existingViolation) {
            if (!existingViolation.forbiddenImports.includes(imp)) {
              existingViolation.forbiddenImports.push(imp);
            }
          } else {
            violations.push({
              file: path.relative(projectRoot, file),
              forbiddenImports: [imp],
              reason: violationReason,
            });
          }
        }
      }
    }

    if (violations.length > 0) {
      const violationMessages = violations
        .map(
          (v) =>
            `\n  ❌ ${v.file}\n     Imports proibidos: ${v.forbiddenImports.join(', ')}\n     Razão: ${v.reason}`,
        )
        .join('\n');

      throw new Error(
        `🚫 VIOLAÇÃO DE ARQUITETURA: Adapters não podem conter regra de negócio!\n${violationMessages}\n\n` +
          'Adapters devem apenas:\n' +
          '- Implementar portas da Application\n' +
          '- Importar tipos/interfaces do domínio (do mesmo módulo)\n\n' +
          'Adapters NÃO podem:\n' +
          '- Importar outros adapters\n' +
          '- Importar controllers\n' +
          '- Conter lógica de negócio',
      );
    }

    expect(violations).toHaveLength(0);
  });
});
