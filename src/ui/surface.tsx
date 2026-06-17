/**
 * Поверхность (карточка/панель) — вариант по умолчанию (Android и web).
 *
 * Сплошной фон + мягкая граница и лёгкая тень. Liquid glass только на iOS —
 * см. `surface.ios.tsx`. Проп `glass` здесь намеренно игнорируется.
 */
import { memo } from 'react';
import { View, type ViewProps, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radii } from '@/theme/tokens';

export type SurfaceProps = ViewProps & {
  /** Уровень поверхности: базовый контейнер или приподнятый. */
  level?: 'container' | 'elevated';
  /** Запрос liquid glass (учитывается только на iOS). */
  glass?: boolean;
  glassStyle?: 'regular' | 'clear';
  bordered?: boolean;
  radius?: number;
};

export const Surface = memo(function Surface({
  level = 'container',
  glass: _glass,
  glassStyle: _glassStyle,
  bordered = true,
  radius = radii.xl,
  style,
  ...rest
}: SurfaceProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: level === 'elevated' ? theme.bgElevated : theme.bgContainer,
          borderRadius: radius,
          borderColor: theme.borderSecondary,
          borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
        },
        style,
      ]}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
