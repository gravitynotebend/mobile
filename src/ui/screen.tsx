/**
 * Контейнер экрана: фон раскладки + безопасные зоны. Опционально — прокрутка.
 * Нижний отступ учитывает нативный таб-бар (`BottomTabInset`).
 *
 * `header` — закреплённый сверху слот (не прокручивается). Когда он задан,
 * верхняя безопасная зона отдаётся хедеру (он сам учитывает `insets.top`),
 * поэтому по умолчанию убираем `top` из `edges`.
 */
import { memo, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { space } from '@/theme/tokens';

const TOP_EDGE: readonly Edge[] = ['top'];
const NO_EDGE: readonly Edge[] = [];

export type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  /** Закреплённый сверху хедер (вне прокручиваемой области). */
  header?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export const Screen = memo(function Screen({
  children,
  scroll = true,
  padded = true,
  edges,
  header,
  contentStyle,
}: ScreenProps) {
  const theme = useTheme();
  const resolvedEdges = edges ?? (header ? NO_EDGE : TOP_EDGE);
  const content = <View style={[padded && styles.padded, contentStyle]}>{children}</View>;

  return (
    <SafeAreaView edges={resolvedEdges} style={[styles.flex, { backgroundColor: theme.bgLayout }]}>
      {header}
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
