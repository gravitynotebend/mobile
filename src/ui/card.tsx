/**
 * Карточка — `Surface` с внутренними отступами. На iOS может быть стеклянной
 * (проп `glass`). Базовый строительный блок для блоков контента.
 */
import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';
import { Surface, type SurfaceProps } from '@/ui/surface';

export type CardProps = SurfaceProps & {
  padded?: boolean;
};

export const Card = memo(function Card({ padded = true, style, ...rest }: CardProps) {
  return <Surface style={[padded && styles.padded, style]} {...rest} />;
});

const styles = StyleSheet.create({
  padded: {
    padding: space.lg,
  },
});
