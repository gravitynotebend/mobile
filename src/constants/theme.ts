/**
 * Реэкспорт дизайн-токенов + базовые константы раскладки.
 *
 * Цвета и типографика заданы в `@/theme/tokens`. Платформенно-зависимые значения
 * (шрифты, нижний отступ под таб-бар) — в `@/constants/platform` (+ `.ios`/`.android`),
 * чтобы не использовать `Platform.select`.
 */
import '@/global.css';

export { Colors, type ThemeColor } from '@/theme/tokens';
export { Fonts, BottomTabInset } from '@/constants/platform';

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;
