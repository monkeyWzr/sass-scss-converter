import { traverseAst } from './traverseAst';
import { addSemicolon } from './addSemicolon';
import { formatScss } from './formatScss';
import { sassMixinIncludeHack } from './sassMixinIncludeHack';
import { sassMixinDefinitionHack } from './sassMixinDefinitionHack';
import { interpolationHack } from './interpolationHack';

let sast: any;

export async function convertSassToScss(sassStr: string): Promise<string> {
  sast = sast || await import('sast');

  const ast = sast.parse(`${sassStr.trim()}\n\n`, { syntax: 'sass' });

  traverseAst(ast, sassMixinIncludeHack);
  traverseAst(ast, sassMixinDefinitionHack);
  traverseAst(ast, addSemicolon);
  traverseAst(ast, interpolationHack);

  const stringifiedTree = sast.stringify(ast, { syntax: 'scss' });

  return formatScss(stringifiedTree).trim().replace(/\r/g, '');
}
