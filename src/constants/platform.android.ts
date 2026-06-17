/** Платформенные константы для Android. */
export const Fonts = {
  sans: 'normal',
  serif: 'serif',
  rounded: 'normal',
  mono: 'monospace',
} as const;

export const BottomTabInset = 80;

/** На Android полагаемся на `adjustResize` (поведение не задаём). */
export const KeyboardBehavior: 'padding' | 'height' | 'position' | undefined = undefined;
