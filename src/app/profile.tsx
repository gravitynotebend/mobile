/**
 * Страница «Профиль» (открывается поверх вкладок из хедера).
 *
 * Хедер — нативный (назад + заголовок). Содержит карточку профиля, оформление
 * (переключатель темы) и меню. Пункты меню пока без действий — наполним вместе
 * с экранами следующего этапа.
 */
import { observer, use$ } from '@legendapp/state/react';
import { StyleSheet, View } from 'react-native';

import { ThemeToggle } from '@/components/theme-toggle';
import { Logout02Icon, Settings02Icon, UserCircleIcon } from '@/icons';
import { useTheme } from '@/hooks/use-theme';
import { selected$ } from '@/state/institution';
import { radii, space } from '@/theme/tokens';
import { Card, Divider, ListRow, Screen, Text } from '@/ui';

export default observer(function ProfileScreen() {
  const theme = useTheme();
  const institution = use$(selected$);

  return (
    <Screen edges={[]}>
      <Card>
        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text variant="title" color={theme.onPrimary}>
              АБ
            </Text>
          </View>
          <View style={styles.identityTexts}>
            <Text variant="subtitle">Анна Бухгалтерова</Text>
            <Text variant="footnote" themeColor="textSecondary">
              {institution ? institution.shortName : 'Главный бухгалтер ЦБ'}
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.cardHead}>
          <Text variant="subtitle">Оформление</Text>
          <Text variant="footnote" themeColor="textSecondary">
            Тема синхронизируется с системой; можно выбрать вручную.
          </Text>
        </View>
        <ThemeToggle />
      </Card>

      <Card padded={false}>
        <ListRow
          icon={UserCircleIcon}
          iconTone="primary"
          title="Профиль бухгалтера"
          subtitle="Личные данные и доступ"
          showChevron
        />
        <Divider inset={70} />
        <ListRow
          icon={Settings02Icon}
          iconTone="neutral"
          title="Настройки"
          subtitle="Параметры приложения"
          showChevron
        />
        <Divider inset={70} />
        <ListRow icon={Logout02Icon} iconTone="red" title="Выйти" />
      </Card>
    </Screen>
  );
});

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityTexts: {
    flex: 1,
    gap: 2,
  },
  cardHead: {
    gap: 2,
    marginBottom: space.md,
  },
});
