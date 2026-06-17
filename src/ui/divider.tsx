/** Тонкий разделитель. По умолчанию — горизонтальная линия цвета границы. */
import { memo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type DividerProps = {
  inset?: number;
  style?: StyleProp<ViewStyle>;
};

export const Divider = memo(function Divider({ inset = 0, style }: DividerProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.line,
        { backgroundColor: theme.borderSecondary, marginLeft: inset },
        style,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
});
