/**
 * Поверхность для iOS с поддержкой liquid glass.
 *
 * Если включён `glass` и устройство поддерживает liquid glass (iOS 26+),
 * рендерится `GlassView` из `expo-glass-effect`. Иначе — сплошная поверхность,
 * идентичная варианту по умолчанию.
 */
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import { useColorSchemeResolved, useTheme } from '@/hooks/use-theme';
import { radii } from '@/theme/tokens';
import type { SurfaceProps } from '@/ui/surface';

export const Surface = memo(function Surface({
  level = 'container',
  glass = false,
  glassStyle = 'regular',
  bordered = true,
  radius = radii.xl,
  style,
  ...rest
}: SurfaceProps) {
  const theme = useTheme();
  const scheme = useColorSchemeResolved();

  if (glass && isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle={glassStyle}
        colorScheme={scheme}
        style={[styles.base, { borderRadius: radius }, style]}
        {...rest}
      />
    );
  }

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
