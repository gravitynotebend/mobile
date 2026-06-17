/**
 * Страница «Уведомления» (открывается поверх вкладок из хедера).
 *
 * Хедер здесь — нативный (назад + заголовок из корневого Stack), поэтому
 * второстепенные элементы главного экрана скрыты. Список сгруппирован по
 * времени; фильтр «Все / Непрочитанные» и «Прочитать все» — на legend-state.
 */
import { observer, use$ } from '@legendapp/state/react';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NotificationRow } from '@/components/notification-row';
import { groupLabels, groupOrder, type Notif } from '@/data/notifications';
import { Tick02Icon } from '@/icons';
import { markAllRead, markRead, notifications$, unreadCount$ } from '@/state/notifications';
import { space } from '@/theme/tokens';
import { Button, Card, Divider, Screen, Segmented, Text } from '@/ui';

type Filter = 'all' | 'unread';

export default observer(function NotificationsScreen() {
  const router = useRouter();
  const items = use$(notifications$);
  const unread = use$(unreadCount$);
  const [filter, setFilter] = useState<Filter>('all');

  const sections = useMemo(() => {
    const visible = filter === 'unread' ? items.filter((n) => !n.read) : items;
    return groupOrder
      .map((group) => ({ group, list: visible.filter((n) => n.group === group) }))
      .filter((section) => section.list.length > 0);
  }, [items, filter]);

  const handlePress = (notif: Notif) => {
    markRead(notif.id);
    if (notif.to) router.push(notif.to);
  };

  return (
    <Screen edges={[]}>
      <View style={styles.toolbar}>
        <View style={styles.segment}>
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { label: 'Все', value: 'all' },
              { label: unread > 0 ? `Непрочитанные · ${unread}` : 'Непрочитанные', value: 'unread' },
            ]}
          />
        </View>
        <Button
          title="Прочитать все"
          variant="text"
          size="sm"
          icon={Tick02Icon}
          disabled={unread === 0}
          onPress={markAllRead}
        />
      </View>

      {sections.length === 0 ? (
        <Card>
          <Text variant="body" themeColor="textSecondary">
            Непрочитанных уведомлений нет.
          </Text>
        </Card>
      ) : (
        sections.map((section) => (
          <View key={section.group} style={styles.group}>
            <Text variant="label" themeColor="textTertiary" style={styles.groupLabel}>
              {groupLabels[section.group].toUpperCase()}
            </Text>
            <Card padded={false}>
              {section.list.map((notif, i) => (
                <View key={notif.id}>
                  {i > 0 ? <Divider inset={68} /> : null}
                  <NotificationRow notif={notif} onPress={handlePress} />
                </View>
              ))}
            </Card>
          </View>
        ))
      )}
    </Screen>
  );
});

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  segment: {
    flex: 1,
  },
  group: {
    gap: space.sm,
  },
  groupLabel: {
    letterSpacing: 0.6,
    paddingHorizontal: space.xs,
  },
});
