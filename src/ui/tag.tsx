/**
 * Статус-чип (Tag) с приглушённой подложкой на основе акцентного цвета.
 * Радиус 8 — как в Ant Design. Цвета адаптируются под тему.
 */
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useColorSchemeResolved } from '@/hooks/use-theme';
import { accents, radii, space, tint } from '@/theme/tokens';
import { Text } from '@/ui/text';

export type TagTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'violet';

const toneToAccent: Record<TagTone, keyof typeof accents.light> = {
  neutral: 'neutral',
  primary: 'primary',
  success: 'green',
  warning: 'amber',
  error: 'red',
  info: 'blue',
  violet: 'violet',
};

export type TagProps = {
  label: string;
  tone?: TagTone;
};

export const Tag = memo(function Tag({ label, tone = 'neutral' }: TagProps) {
  const scheme = useColorSchemeResolved();
  const accent = accents[scheme][toneToAccent[tone]];
  return (
    <View style={[styles.base, { backgroundColor: tint(accent, scheme === 'dark' ? 0.2 : 0.12) }]}>
      <Text variant="caption" color={accent} style={styles.label}>
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radii.sm,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
  },
  label: {
    fontWeight: '600',
  },
});
