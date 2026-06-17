/**
 * Pressable с мягким уменьшением масштаба при нажатии.
 *
 * Анимация на Reanimated через `withTiming` (без пружин) — спокойная мобильная
 * физика, как договаривались: меньше bounce/spring, плавно и предсказуемо.
 */
import { memo, useCallback } from 'react';
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = PressableProps & {
  /** Во сколько раз сжимать при нажатии. */
  activeScale?: number;
  style?: StyleProp<ViewStyle>;
};

export const PressableScale = memo(function PressableScale({
  activeScale = 0.97,
  onPressIn,
  onPressOut,
  style,
  children,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      scale.value = withTiming(activeScale, { duration: 120, easing: Easing.out(Easing.quad) });
      onPressIn?.(e);
    },
    [activeScale, onPressIn, scale],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      scale.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) });
      onPressOut?.(e);
    },
    [onPressOut, scale],
  );

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
});
