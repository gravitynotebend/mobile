/**
 * Живой аватар ассистента (порт веба на Reanimated 4 + react-native-svg).
 *
 * Спокойный (idle) — улыбка, которая моргает и мягко «дышит».
 * thinking — улыбка перетекает во вращающийся лоадер.
 * search — перетекает в лупу с лёгким покачиванием.
 *
 * Переходы между состояниями — плавный кросс-фейд (короткий timing, без
 * «желейных» пружин). Непрерывное вращение лоадера — линейный `withRepeat`.
 */
import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

export type AvatarState = 'idle' | 'thinking' | 'search';

const AnimatedG = Animated.createAnimatedComponent(G);
const CROSSFADE = { duration: 300, easing: Easing.out(Easing.cubic) };

export const AiAvatar = memo(function AiAvatar({
  state = 'idle',
  size = 46,
}: {
  state?: AvatarState;
  size?: number;
}) {
  const theme = useTheme();
  const color = theme.primary;

  const breathe = useSharedValue(1);
  const idle = useSharedValue(state === 'idle' ? 1 : 0);
  const think = useSharedValue(state === 'thinking' ? 1 : 0);
  const search = useSharedValue(state === 'search' ? 1 : 0);
  const spin = useSharedValue(0);
  const blink = useSharedValue(1);
  const wobble = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1700, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    spin.value = withRepeat(withTiming(360, { duration: 850, easing: Easing.linear }), -1, false);
    blink.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600 }),
        withTiming(0.1, { duration: 80 }),
        withTiming(1, { duration: 90 }),
      ),
      -1,
      false,
    );
    wobble.value = withRepeat(
      withSequence(
        withTiming(7, { duration: 820, easing: Easing.inOut(Easing.quad) }),
        withTiming(-7, { duration: 820, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [breathe, spin, blink, wobble]);

  useEffect(() => {
    idle.value = withTiming(state === 'idle' ? 1 : 0, CROSSFADE);
    think.value = withTiming(state === 'thinking' ? 1 : 0, CROSSFADE);
    search.value = withTiming(state === 'search' ? 1 : 0, CROSSFADE);
  }, [state, idle, think, search]);

  const outerStyle = useAnimatedStyle(() => ({ transform: [{ scale: breathe.value }] }));
  const idleStyle = useAnimatedStyle(() => ({ opacity: idle.value, transform: [{ scale: 0.55 + idle.value * 0.45 }] }));
  const thinkStyle = useAnimatedStyle(() => ({
    opacity: think.value,
    transform: [{ scale: 0.55 + think.value * 0.45 }, { rotate: `${spin.value}deg` }],
  }));
  const searchStyle = useAnimatedStyle(() => ({
    opacity: search.value,
    transform: [{ scale: 0.55 + search.value * 0.45 }, { rotate: `${wobble.value}deg` }],
  }));
  const eyesProps = useAnimatedProps(() => ({ scaleY: blink.value, originY: 9.6, originX: 12 }));

  return (
    <Animated.View style={[{ width: size, height: size }, outerStyle]}>
      <Animated.View style={[styles.layer, idleStyle]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <AnimatedG animatedProps={eyesProps}>
            <Circle cx="8.4" cy="9.6" r="1.55" fill={color} />
            <Circle cx="15.6" cy="9.6" r="1.55" fill={color} />
          </AnimatedG>
          <Path d="M7.4 13.8 Q12 18.4 16.6 13.8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.layer, thinkStyle]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="8.2" stroke={color} strokeWidth="2.2" fill="none" opacity={0.18} />
          <Path d="M12 3.8 A8.2 8.2 0 0 1 20.2 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.layer, searchStyle]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="10.2" cy="10.2" r="5.5" stroke={color} strokeWidth="2.1" fill="none" />
          <Line x1="14.3" y1="14.3" x2="19" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
