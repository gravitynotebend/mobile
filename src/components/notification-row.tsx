/**
 * Строка уведомления: цветная плитка-иконка по типу, заголовок/описание/время и
 * точка непрочитанного. Тип различается иконкой и акцентом (см. `typeMeta`).
 */
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { type Notif, typeMeta } from '@/data/notifications';
import { useAccent } from '@/hooks/use-theme';
import { radii, space, tint } from '@/theme/tokens';
import { Icon } from '@/ui/icon';
import { PressableScale } from '@/ui/pressable-scale';
import { Text } from '@/ui/text';

export const NotificationRow = memo(function NotificationRow({
  notif,
  onPress,
}: {
  notif: Notif;
  onPress: (notif: Notif) => void;
}) {
  const accent = useAccent();
  const meta = typeMeta[notif.type];
  const color = accent[meta.accent];

  return (
    <PressableScale
      activeScale={0.99}
      onPress={() => onPress(notif)}
      accessibilityRole="button"
      style={styles.row}>
      <View style={[styles.tile, { backgroundColor: tint(color, 0.14) }]}>
        <Icon icon={meta.icon} size={19} color={color} strokeWidth={2} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.title}>
            {notif.title}
          </Text>
          {notif.read ? null : <View style={[styles.dot, { backgroundColor: color }]} />}
        </View>
        <Text variant="footnote" themeColor="textSecondary" numberOfLines={2}>
          {notif.desc}
        </Text>
        <Text variant="caption" themeColor="textTertiary" style={styles.time}>
          {notif.time}
        </Text>
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
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
  body: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  title: {
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  time: {
    marginTop: 2,
  },
});
