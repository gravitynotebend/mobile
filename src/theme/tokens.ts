/**
 * Дизайн-токены приложения «ЦентрБаланс».
 *
 * Палитра портирована из веб-версии (Ant Design `theme.ts`): спокойный
 * сине-стальной акцент, мягкий фон вместо «слепящего» белого, приглушённые
 * статусные цвета. Здесь — единственный источник правды по цветам, отступам,
 * радиусам и типографике для нативного приложения.
 */
import type { TextStyle } from 'react-native';

export type ColorScheme = 'light' | 'dark';

/** Радиусы скругления (борд-радиусы AntD: base 12, card 16, control 10). */
export const radii = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

/** Шкала отступов (4-pt grid). */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

type FontWeight = TextStyle['fontWeight'];

/** Типографика в духе iOS/AntD (базовый размер 14). */
export const font = {
  size: {
    caption: 12,
    footnote: 13,
    body: 14,
    callout: 16,
    headline: 18,
    title3: 20,
    title2: 24,
    title1: 30,
  },
  weight: {
    regular: '400' as FontWeight,
    medium: '500' as FontWeight,
    semibold: '600' as FontWeight,
    bold: '700' as FontWeight,
  },
  lineHeight: {
    caption: 16,
    body: 20,
    callout: 22,
    headline: 24,
    title: 34,
  },
} as const;

/**
 * Семантические цвета. Светлая и тёмная палитры имеют идентичный набор ключей,
 * поэтому `ThemeColor` един для обеих тем.
 */
export const Colors = {
  light: {
    // Акцент
    primary: '#2E5AAC',
    primarySoft: 'rgba(46, 90, 172, 0.12)',
    onPrimary: '#FFFFFF',
    info: '#2E5AAC',
    link: '#2E5AAC',
    // Статусы
    success: '#1F8A52',
    warning: '#B87708',
    error: '#CF3A2E',
    // Текст
    textHeading: '#1F2733',
    text: '#222B38',
    textSecondary: '#59616F',
    textTertiary: '#878E9B',
    // Поверхности
    bgLayout: '#F3F4F7',
    bgContainer: '#FFFFFF',
    bgElevated: '#FFFFFF',
    bgSpotlight: '#EDEFF4',
    fill: '#EDEFF4',
    fillSecondary: '#F5F7FA',
    // Границы
    border: '#DBDEE5',
    borderSecondary: '#E8EAEF',
  },
  dark: {
    primary: '#5E8BE0',
    primarySoft: 'rgba(94, 139, 224, 0.18)',
    onPrimary: '#0E1116',
    info: '#5E8BE0',
    link: '#7CA4EC',
    success: '#46C288',
    warning: '#E0A33A',
    error: '#EE7B73',
    textHeading: '#EDF0F5',
    text: '#D5DAE3',
    textSecondary: '#98A1B0',
    textTertiary: '#69727F',
    bgLayout: '#14181F',
    bgContainer: '#1A1F28',
    bgElevated: '#222834',
    bgSpotlight: '#283041',
    fill: 'rgba(255, 255, 255, 0.06)',
    fillSecondary: 'rgba(255, 255, 255, 0.03)',
    border: '#2C3340',
    borderSecondary: '#252B35',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;
/** Обе палитры имеют одинаковый набор ключей, значения — цвета (строки). */
export type Theme = Record<ThemeColor, string>;

/**
 * Семантические акцентные цвета для иконок-плиток, графиков, статус-чипов.
 * Тёмные варианты светлее и менее насыщенные, чтобы не «слепить» на тёмном фоне.
 */
export type AccentName = 'primary' | 'blue' | 'green' | 'amber' | 'red' | 'violet' | 'neutral';
export type AccentPalette = Record<AccentName, string>;

export const accents: Record<ColorScheme, AccentPalette> = {
  light: {
    primary: '#2E5AAC',
    blue: '#2E5AAC',
    green: '#1F8A52',
    amber: '#B87708',
    red: '#CF3A2E',
    violet: '#5B53C9',
    neutral: '#6B7280',
  },
  dark: {
    primary: '#5E8BE0',
    blue: '#5E8BE0',
    green: '#46C288',
    amber: '#E0A33A',
    red: '#EE7B73',
    violet: '#9B93EE',
    neutral: '#8A93A3',
  },
};

/** Полупрозрачная подложка под иконку/чип на основе акцентного цвета. */
export function tint(hex: string, alpha = 0.14): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
