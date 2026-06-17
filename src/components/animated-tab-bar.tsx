/**
 * Кастомный анимированный таб-бар для Android.
 *
 * Дизайн-принципы (госсектор / профессиональное ПО):
 * – Чистый, лаконичный вид без визуального шума.
 * – Чёткая обратная связь: активная вкладка выделяется цветом и фоновой
 *   подсветкой, неактивная — приглушена.
 * – Чёткие, быстрые переходы (Reanimated 4, короткий `withTiming` + cubic-out,
 *   без пружин и «желе»), чтобы не отвлекать от рабочего процесса.
 * – Доступность: крупные тач-зоны, контрастные цвета, подписи к иконкам.
 */
import { useCallback, useEffect, memo } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_DEFS } from '@/components/tabs';
import { useTheme } from '@/hooks/use-theme';
import { space } from '@/theme/tokens';
import { Icon } from '@/ui/icon';
import { Text } from '@/ui/text';

/** Чёткий «несклеенный» переход без overshoot. */
const SNAP = { duration: 220, easing: Easing.out(Easing.cubic) } as const;
const SNAP_FAST = { duration: 160, easing: Easing.out(Easing.cubic) } as const;

/** Reanimated-обёртки для избежания конфликтов типов с memo-компонентами. */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

type TabItemProps = {
  tab: typeof TAB_DEFS[number];
  isFocused: boolean;
  onPress: () => void;
  tabWidth: number;
};

const TabItem = memo(function TabItem({ tab, isFocused, onPress, tabWidth }: TabItemProps) {
  const theme = useTheme();
  const scale = useSharedValue(isFocused ? 1 : 0.92);
  const labelOpacity = useSharedValue(isFocused ? 1 : 0.7);

  useEffect(() => {
    scale.value = withTiming(isFocused ? 1 : 0.92, SNAP_FAST);
    labelOpacity.value = withTiming(isFocused ? 1 : 0.7, SNAP_FAST);
  }, [isFocused, scale, labelOpacity]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedLabelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={[styles.tab, { width: tabWidth }]}
      android_ripple={{ color: theme.primarySoft, borderless: true }}>
      <AnimatedView style={animatedIconStyle}>
        <Icon
          icon={tab.icon}
          size={22}
          color={isFocused ? theme.primary : theme.textTertiary}
          strokeWidth={isFocused ? 2 : 1.6}
        />
      </AnimatedView>
      <AnimatedView style={animatedLabelStyle}>
        <Text
          variant="caption"
          color={isFocused ? theme.primary : theme.textTertiary}
          style={styles.label}>
          {tab.label}
        </Text>
      </AnimatedView>
    </AnimatedPressable>
  );
});

export function AnimatedTabBar({ state, navigation }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const tabWidth = width / TAB_DEFS.length;
  const indicatorX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    indicatorX.value = withTiming(state.index * tabWidth, SNAP);
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handlePress = useCallback(
    (index: number) => {
      const isFocused = state.index === index;
      const event = navigation.emit({
        type: 'tabPress',
        target: state.routes[index]?.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(state.routes[index].name);
      }
    },
    [navigation, state]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bgContainer,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, space.md),
        },
      ]}>
      {/* Фоновый «пилл» активной вкладки */}
      <AnimatedView
        style={[
          styles.indicator,
          {
            width: tabWidth - space.sm * 2,
            backgroundColor: theme.primarySoft,
          },
          indicatorStyle,
        ]}
      />

      <View style={styles.row}>
        {TAB_DEFS.map((tab, index) => (
          <TabItem
            key={tab.name}
            tab={tab}
            isFocused={state.index === index}
            onPress={() => handlePress(index)}
            tabWidth={tabWidth}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  indicator: {
    position: 'absolute',
    top: 6,
    height: 40,
    borderRadius: 12,
    marginHorizontal: space.sm,
  },
  row: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 2,
  },
  label: {
    marginTop: 2,
  },
});
