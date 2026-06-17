/**
 * Контекстный хедер приложения.
 *
 * На главной (`variant="home"`) — бренд «ЦБ» + название + текущее учреждение
 * и полный набор действий. На остальных вкладках (`variant="section"`) — заголовок
 * раздела и подзаголовок. На страницах деталей хедер не используется вовсе —
 * там нативный заголовок Stack (назад + название), поэтому второстепенные
 * элементы скрываются автоматически.
 *
 * Действия справа: быстрый переход к Ассистенту, колокольчик уведомлений с
 * бейджем непрочитанных и аватар профиля. Бейдж подписан точечно через
 * `use$(unreadCount$)` — перерисовывается только при изменении счётчика.
 */
import { type IconSvgElement } from '@hugeicons/react-native';
import { observer, use$ } from '@legendapp/state/react';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BubbleChatIcon, Notification03Icon } from '@/icons';
import { useTheme } from '@/hooks/use-theme';
import { selected$ } from '@/state/institution';
import { unreadCount$ } from '@/state/notifications';
import { radii, space } from '@/theme/tokens';
import { Icon } from '@/ui/icon';
import { PressableScale } from '@/ui/pressable-scale';
import { Text } from '@/ui/text';

export type AppHeaderProps = {
  variant?: 'home' | 'section';
  title: string;
  subtitle?: string;
  /** Показывать ли быстрый переход к Ассистенту (скрыт на самом Ассистенте). */
  showAssistantShortcut?: boolean;
};

const HeaderAction = memo(function HeaderAction({
  icon,
  onPress,
  badge,
  label,
}: {
  icon: IconSvgElement;
  onPress: () => void;
  badge?: number;
  label: string;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={styles.actionWrap}>
      <View style={[styles.action, { backgroundColor: theme.fillSecondary }]}>
        <Icon icon={icon} size={20} themeColor="text" />
      </View>
      {badge && badge > 0 ? (
        <View style={[styles.badge, { backgroundColor: theme.primary, borderColor: theme.bgContainer }]}>
          <Text variant="caption" color={theme.onPrimary} style={styles.badgeText}>
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      ) : null}
    </PressableScale>
  );
});

export const AppHeader = observer(function AppHeader({
  variant = 'section',
  title,
  subtitle,
  showAssistantShortcut = true,
}: AppHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const unread = use$(unreadCount$);
  const institution = use$(selected$);

  const resolvedSubtitle =
    variant === 'home' ? (institution ? institution.shortName : 'Все учреждения') : subtitle;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + space.sm,
          backgroundColor: theme.bgContainer,
          borderBottomColor: theme.borderSecondary,
        },
      ]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={[styles.brand, { backgroundColor: theme.primary }]}>
            <Text variant="caption" color={theme.onPrimary} style={styles.brandText}>
              ЦБ
            </Text>
          </View>
          <View style={styles.titles}>
            <Text variant="bodyStrong" numberOfLines={1}>
              {title}
            </Text>
            {resolvedSubtitle ? (
              <Text variant="footnote" themeColor="textSecondary" numberOfLines={1}>
                {resolvedSubtitle}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.actions}>
          {showAssistantShortcut ? (
            <HeaderAction
              icon={BubbleChatIcon}
              label="Ассистент"
              onPress={() => router.push('/assistant')}
            />
          ) : null}
          <HeaderAction
            icon={Notification03Icon}
            label="Уведомления"
            badge={unread}
            onPress={() => router.push('/notifications')}
          />
          <PressableScale
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Профиль"
            hitSlop={6}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text variant="label" color={theme.onPrimary}>
                АБ
              </Text>
            </View>
          </PressableScale>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minWidth: 0,
  },
  brand: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontWeight: '700',
  },
  titles: {
    flex: 1,
    minWidth: 0,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  actionWrap: {
    position: 'relative',
  },
  action: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -3,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
});
