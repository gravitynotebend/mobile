/**
 * Контейнер экрана: фон раскладки + безопасные зоны. Опционально — прокрутка.
 * Нижний отступ учитывает нативный таб-бар (`BottomTabInset`).
 */
import { memo, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { space } from '@/theme/tokens';

export type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  contentStyle?: StyleProp<ViewStyle>;
};

export const Screen = memo(function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ['top'],
  contentStyle,
}: ScreenProps) {
  const theme = useTheme();
  const content = (
    <View style={[padded && styles.padded, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: theme.bgLayout }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic">
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + space.xl,
  },
  padded: {
    padding: space.lg,
    gap: space.lg,
  },
});
