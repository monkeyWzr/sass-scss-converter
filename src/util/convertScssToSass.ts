import { traverseAst } from './traverseAst';
import { formatSass } from './formatSass';
import { removeSemicolon } from './removeSemicolon';
import { interpolationHack } from './interpolationHack';

let sast: any;

export async function convertScssToSass(scssStr: string): Promise<string> {
  sast = sast || await import('sast');

  const tree = sast.parse(`${scssStr.trim()}\n\n`, { syntax: 'scss' });

  traverseAst(tree, removeSemicolon);
  traverseAst(tree, interpolationHack);

  const stringifiedTree = sast.stringify(tree, { syntax: 'sass' });

  return formatSass(stringifiedTree).trim().replace(/\r/g, '');
}
