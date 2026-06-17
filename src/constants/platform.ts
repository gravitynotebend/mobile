/**
 * Платформенные константы — вариант по умолчанию.
 *
 * Реальные значения для iOS/Android лежат в `platform.ios.ts` / `platform.android.ts`.
 * Так мы избегаем `Platform.select` и разводим различия по расширениям файлов.
 * Этот базовый файл — фолбэк и источник типов; на устройстве всегда выбирается
 * `.ios`/`.android`.
 */
export const Fonts = {
  sans: 'System',
  serif: 'serif',
  rounded: 'System',
  mono: 'monospace',
} as const;

export const BottomTabInset = 64;

/** Поведение `KeyboardAvoidingView`. На Android полагаемся на `adjustResize`. */
export const KeyboardBehavior: 'padding' | 'height' | 'position' | undefined = undefined;
