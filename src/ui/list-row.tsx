/**
 * Строка списка: ведущая иконка в цветной плитке, заголовок/подзаголовок,
 * хвостовое значение и/или шеврон. Нажатие — мягкий scale.
 */
import { type IconSvgElement } from '@hugeicons/react-native';
import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ArrowRight01Icon } from '@/icons';
import { useColorSchemeResolved } from '@/hooks/use-theme';
import { accents, type AccentName, radii, space, tint } from '@/theme/tokens';
import { Icon } from '@/ui/icon';
import { PressableScale } from '@/ui/pressable-scale';
import { Text } from '@/ui/text';

export type ListRowProps = {
  title: string;
  subtitle?: string;
  icon?: IconSvgElement;
  iconTone?: AccentName;
  value?: string;
  trailing?: ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
};

export const ListRow = memo(function ListRow({
  title,
  subtitle,
  icon,
  iconTone = 'primary',
  value,
  trailing,
  showChevron = false,
  onPress,
}: ListRowProps) {
  const scheme = useColorSchemeResolved();
  const accent = accents[scheme][iconTone];

  return (
    <PressableScale
      activeScale={0.985}
      disabled={!onPress}
      onPress={onPress}
      style={styles.row}>
      {icon ? (
        <View style={[styles.tile, { backgroundColor: tint(accent, scheme === 'dark' ? 0.22 : 0.12) }]}>
          <Icon icon={icon} size={20} color={accent} />
        </View>
      ) : null}

      <View style={styles.texts}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="footnote" themeColor="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value ? (
        <Text variant="callout" themeColor="textHeading" style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {trailing}
      {showChevron ? <Icon icon={ArrowRight01Icon} size={18} themeColor="textTertiary" /> : null}
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  tile: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  value: {
    fontWeight: '600',
  },
});
