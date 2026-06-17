/**
 * Платформенные константы — вариант по умолчанию (web и прочие цели).
 *
 * Реальные значения для iOS/Android лежат в `platform.ios.ts` / `platform.android.ts`.
 * Так мы избегаем `Platform.select` и разводим различия по расширениям файлов.
 */
export const Fonts = {
  sans: 'var(--font-display)',
  serif: 'var(--font-serif)',
  rounded: 'var(--font-rounded)',
  mono: 'var(--font-mono)',
} as const;

export const BottomTabInset = 0;
