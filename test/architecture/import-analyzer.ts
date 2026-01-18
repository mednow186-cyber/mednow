import * as fs from 'fs';
import * as path from 'path';

export interface ImportViolation {
  file: string;
  importPath: string;
  line?: number;
}

export class ImportAnalyzer {
  /**
   * Encontra todos os arquivos TypeScript recursivamente em um diretório
   */
  static findTypeScriptFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.findTypeScriptFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        // Ignorar arquivos de teste e definições
        if (
          !entry.name.endsWith('.spec.ts') &&
          !entry.name.endsWith('.test.ts') &&
          !entry.name.endsWith('.d.ts')
        ) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  /**
   * Extrai todos os imports de um arquivo TypeScript
   */
  static extractImports(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports: string[] = [];

    // Regex para capturar imports:
    // import ... from 'module'
    // import ... from "module"
    // import 'module'
    // import "module"
    const importRegex =
      /import\s+(?:(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*)|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;

    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1] || match[2];
      if (importPath) {
        imports.push(importPath);
      }
    }

    return imports;
  }

  /**
   * Verifica se um import viola as regras de dependência proibidas
   */
  static checkForbiddenImports(
    imports: string[],
    forbiddenPatterns: string[],
  ): string[] {
    const violations: string[] = [];

    for (const importPath of imports) {
      for (const pattern of forbiddenPatterns) {
        if (importPath.startsWith(pattern)) {
          violations.push(importPath);
          break;
        }
      }
    }

    return violations;
  }

  /**
   * Normaliza o caminho para comparação (usa barras / independente do OS)
   */
  static normalizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/');
  }
}
