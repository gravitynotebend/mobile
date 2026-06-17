/**
 * Определения вкладок (5 разделов веб-приложения «ЦентрБаланс»).
 *
 * Иконки заданы через SF Symbols (iOS) и Material (Android) — нативные векторы
 * без png-ассетов, чтобы сохранить системный (в т.ч. liquid glass) таб-бар.
 * Короткие подписи для таб-бара; полные названия разделов — в заголовках экранов.
 */
import type { AndroidSymbol } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';

export type TabDef = {
  name: string;
  label: string;
  sf: SFSymbol;
  md: AndroidSymbol;
};

// `as const` сохраняет строковые литералы, `satisfies` проверяет, что имена
// иконок валидны для SF Symbols (iOS) и Material (Android).
export const TAB_DEFS = [
  { name: 'index', label: 'Обзор', sf: 'square.grid.2x2', md: 'dashboard' },
  { name: 'uchet', label: 'Учёт', sf: 'doc.text', md: 'receipt_long' },
  { name: 'control', label: 'Контроль', sf: 'checkmark.shield', md: 'verified_user' },
  { name: 'docflow', label: 'Письма', sf: 'envelope', md: 'mail' },
  { name: 'assistant', label: 'Ассистент', sf: 'bubble.left.and.bubble.right', md: 'chat' },
] as const satisfies readonly TabDef[];
