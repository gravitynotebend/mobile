/**
 * Кнопка в духе Ant Design: высота контрола 36, радиус 10, средний вес текста.
 * Варианты: primary / secondary (контур) / ghost / text. Нажатие — мягкий scale.
 */
import { type IconSvgElement } from '@hugeicons/react-native';
import { memo } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { radii, space, type Theme } from '@/theme/tokens';
import { Icon } from '@/ui/icon';
import { PressableScale } from '@/ui/pressable-scale';
import { Text } from '@/ui/text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'text';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  icon?: IconSvgElement;
  iconRight?: IconSvgElement;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  style?: StyleProp<ViewStyle>;
};

function backgroundFor(variant: ButtonVariant, theme: Theme): string {
  if (variant === 'primary') return theme.primary;
  if (variant === 'secondary') return theme.bgContainer;
  return 'transparent';
}

function foregroundFor(variant: ButtonVariant, theme: Theme): string {
  if (variant === 'primary') return theme.onPrimary;
  if (variant === 'text' || variant === 'ghost') return theme.primary;
  return theme.text;
}

export const Button = memo(function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled = false,
  loading = false,
  block = false,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const fg = foregroundFor(variant, theme);
  const height = size === 'sm' ? 30 : 36;
  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <PressableScale
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        {
          height,
          paddingHorizontal: size === 'sm' ? space.md : space.lg,
          backgroundColor: backgroundFor(variant, theme),
          borderColor: variant === 'secondary' ? theme.border : 'transparent',
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          opacity: disabled ? 0.45 : 1,
        },
        block && styles.block,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon icon={icon} size={iconSize} color={fg} /> : null}
          <Text variant="bodyStrong" color={fg}>
            {title}
          </Text>
          {iconRight ? <Icon icon={iconRight} size={iconSize} color={fg} /> : null}
        </View>
      )}
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
});
