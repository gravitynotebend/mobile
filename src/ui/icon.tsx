/**
 * Тонкая обёртка над `HugeiconsIcon`.
 *
 * Цвет по умолчанию берётся из текущей темы, так что иконки автоматически
 * подстраиваются под светлую/тёмную схему. Данные иконок — из `@/icons`.
 */
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { memo } from 'react';

import { useTheme } from '@/hooks/use-theme';
import type { ThemeColor } from '@/theme/tokens';

export type IconProps = {
  icon: IconSvgElement;
  size?: number;
  /** Прямой цвет (имеет приоритет над `themeColor`). */
  color?: string;
  /** Ключ цвета из темы. По умолчанию — основной текст. */
  themeColor?: ThemeColor;
  strokeWidth?: number;
};

export const Icon = memo(function Icon({
  icon,
  size = 22,
  color,
  themeColor = 'text',
  strokeWidth = 1.8,
}: IconProps) {
  const theme = useTheme();
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color ?? theme[themeColor]}
      strokeWidth={strokeWidth}
    />
  );
});
