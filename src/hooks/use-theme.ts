/**
 * Разрешение темы: комбинирует системную схему (`useColorScheme`) с сохранённым
 * предпочтением пользователя (`themePref$`). Возвращает готовый набор токенов.
 *
 * Подписка на `themePref$` точечная (`use$`), поэтому перерисовываются только
 * компоненты, реально использующие тему.
 *
 * Подробнее о светлой/тёмной темах: https://docs.expo.dev/guides/color-schemes/
 */
import { use$ } from '@legendapp/state/react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { themePref$ } from '@/state/theme';
import { accents, Colors, type AccentPalette, type ColorScheme, type Theme } from '@/theme/tokens';

export function useColorSchemeResolved(): ColorScheme {
  const system = useColorScheme();
  const pref = use$(themePref$);
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}

export function useTheme(): Theme {
  return Colors[useColorSchemeResolved()];
}

/** Акцентная палитра для текущей схемы (иконки-плитки, чипы, графики). */
export function useAccent(): AccentPalette {
  return accents[useColorSchemeResolved()];
}
