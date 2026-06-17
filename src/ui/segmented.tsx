/**
 * Сегментированный переключатель (Ant Design Segmented) с плавно скользящим
 * индикатором на Reanimated (`withTiming`, без пружин).
 */
import { type IconSvgElement } from '@hugeicons/react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useColorSchemeResolved, useTheme } from '@/hooks/use-theme';
import { radii, space } from '@/theme/tokens';
import { Icon } from '@/ui/icon';
import { Text } from '@/ui/text';

export type SegmentedOption<T extends string> = {
  label: string;
  value: T;
  icon?: IconSvgElement;
};

export type SegmentedProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

const PADDING = 3;

export function Segmented<T extends string>({ options, value, onChange, style }: SegmentedProps<T>) {
  const theme = useTheme();
  const scheme = useColorSchemeResolved();
  const [trackWidth, setTrackWidth] = useState(0);

  const count = options.length;
  const segWidth = trackWidth > 0 ? (trackWidth - PADDING * 2) / count : 0;
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(index * segWidth, { duration: 220, easing: Easing.out(Easing.cubic) });
  }, [index, segWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: segWidth,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      style={[styles.track, { backgroundColor: theme.fill, padding: PADDING }, style]}>
      {segWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            indicatorStyle,
            {
              backgroundColor: scheme === 'dark' ? theme.bgSpotlight : theme.bgContainer,
            },
          ]}
        />
      ) : null}
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={styles.segment}>
            {option.icon ? (
              <Icon
                icon={option.icon}
                size={16}
                color={active ? theme.primary : theme.textSecondary}
              />
            ) : null}
            <Text
              variant="label"
              color={active ? theme.textHeading : theme.textSecondary}
              numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: radii.md,
  },
  segment: {
    flex: 1,
    height: 32,
    flexDirection: 'row',
    gap: space.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
