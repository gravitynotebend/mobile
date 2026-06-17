/**
 * Разрешение темы: комбинирует системную схему (`useColorScheme`) с сохранённым
 * предпочтением пользователя (`themePref$`). Возвращает готовый набор токенов.
 *
 * Подписка через `useSyncExternalStore` — стандартный React-API для внешних
 * хранилищ. Обходит баг v3-beta `use$` с AsyncStorage-персистентностью.
 *
 * Подробнее о светлой/тёмной темах: https://docs.expo.dev/guides/color-schemes/
 */
import { useSyncExternalStore } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { themePref$ } from '@/state/theme';
import { accents, Colors, type AccentPalette, type ColorScheme, type Theme } from '@/theme/tokens';

function subscribeThemePref(callback: () => void) {
  const unsub = themePref$.onChange(() => callback());
  return unsub;
}

function getThemePref(): string {
  try {
    const v = themePref$.get();
    return typeof v === 'string' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function useColorSchemeResolved(): ColorScheme {
  const system = useColorScheme();
  const pref = useSyncExternalStore(subscribeThemePref, getThemePref, () => 'system');

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
