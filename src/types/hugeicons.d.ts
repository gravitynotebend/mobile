/**
 * Типы для импорта отдельных иконок HugeIcons по подпути.
 *
 * Пакет `@hugeicons/core-free-icons` не поставляет per-icon `.d.ts`, поэтому
 * объявляем wildcard-модуль. Импорт каждой иконки напрямую из `dist/esm/*`
 * (а не из бочки-индекса) позволяет бандлеру не тащить все ~11k иконок.
 */
declare module '@hugeicons/core-free-icons/dist/esm/*' {
  import type { IconSvgElement } from '@hugeicons/react-native';

  const icon: IconSvgElement;
  export default icon;
}
