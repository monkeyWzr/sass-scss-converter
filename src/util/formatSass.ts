import { SassFormatter } from 'sass-formatter';

export function formatSass(rawStr: string, tabSize = 2): string {
  return SassFormatter.Format(
    rawStr,
    {
      insertSpaces: true,
      tabSize,
    },
  );
}
