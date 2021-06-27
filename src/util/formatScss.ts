import scssfmt from 'scssfmt';

export function formatScss(rawStr: string): string {
  return scssfmt(rawStr);
}
