/**
 * Типографика дизайн-системы. Варианты соответствуют шкале токенов
 * (`@/theme/tokens`) и автоматически берут цвет из текущей темы.
 */
import { memo } from 'react';
import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { font, type ThemeColor } from '@/theme/tokens';

export type TextVariant =
  | 'largeTitle'
  | 'title'
  | 'subtitle'
  | 'headline'
  | 'body'
  | 'bodyStrong'
  | 'callout'
  | 'label'
  | 'footnote'
  | 'caption';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  themeColor?: ThemeColor;
  color?: string;
};

export const Text = memo(function Text({
  variant = 'body',
  themeColor,
  color,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const defaultColor: ThemeColor =
    variant === 'largeTitle' || variant === 'title' || variant === 'subtitle' ? 'textHeading' : 'text';
  return (
    <RNText
      style={[styles[variant], { color: color ?? theme[themeColor ?? defaultColor] }, style]}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  largeTitle: { fontSize: font.size.title1, lineHeight: font.lineHeight.title, fontWeight: font.weight.bold },
  title: { fontSize: font.size.title2, lineHeight: 30, fontWeight: font.weight.semibold },
  subtitle: { fontSize: font.size.title3, lineHeight: 26, fontWeight: font.weight.semibold },
  headline: { fontSize: font.size.headline, lineHeight: font.lineHeight.headline, fontWeight: font.weight.semibold },
  body: { fontSize: font.size.body, lineHeight: font.lineHeight.body, fontWeight: font.weight.regular },
  bodyStrong: { fontSize: font.size.body, lineHeight: font.lineHeight.body, fontWeight: font.weight.semibold },
  callout: { fontSize: font.size.callout, lineHeight: font.lineHeight.callout, fontWeight: font.weight.regular },
  label: { fontSize: font.size.footnote, lineHeight: 18, fontWeight: font.weight.medium },
  footnote: { fontSize: font.size.footnote, lineHeight: 18, fontWeight: font.weight.regular },
  caption: { fontSize: font.size.caption, lineHeight: font.lineHeight.caption, fontWeight: font.weight.regular },
});
