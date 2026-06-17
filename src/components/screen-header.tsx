/** Заголовок экрана: крупный титул, опциональный подзаголовок и слот справа. */
import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { space } from '@/theme/tokens';
import { Text } from '@/ui/text';

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
};

export const ScreenHeader = memo(function ScreenHeader({ title, subtitle, trailing }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text variant="largeTitle">{title}</Text>
        {subtitle ? (
          <Text variant="footnote" themeColor="textSecondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
