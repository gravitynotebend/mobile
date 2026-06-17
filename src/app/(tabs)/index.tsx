/**
 * Обзор — витрина фундамента: заголовок, выбор учреждения, переключатель темы и
 * демонстрация примитивов дизайн-системы (карточки, строки, теги, кнопки).
 * Реальные виджеты дашборда портируются следующим этапом.
 */
import { View, StyleSheet } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { InstitutionCard } from '@/components/institution-card';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  AnalyticsUpIcon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  SecurityCheckIcon,
} from '@/icons';
import { space } from '@/theme/tokens';
import { Button, Card, Divider, ListRow, Screen, Tag, Text } from '@/ui';

export default function OverviewScreen() {
  return (
    <Screen header={<AppHeader variant="home" title="ЦентрБаланс" />}>
      <InstitutionCard />

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
        <View style={styles.sectionHead}>
          <Text variant="subtitle">Сводка</Text>
          <Tag label="демо" tone="neutral" />
        </View>
        <Divider />
        <ListRow
          icon={CheckmarkCircle02Icon}
          iconTone="green"
          title="Документы на согласовании"
          subtitle="Учёт"
          value="12"
          showChevron
        />
        <Divider inset={70} />
        <ListRow
          icon={SecurityCheckIcon}
          iconTone="amber"
          title="Выявленные риски"
          subtitle="Контроль"
          value="3"
          showChevron
        />
        <Divider inset={70} />
        <ListRow
          icon={Mail01Icon}
          iconTone="blue"
          title="Входящие письма"
          subtitle="Документооборот"
          value="5"
          showChevron
        />
      </Card>

      <Card>
        <View style={styles.cardHead}>
          <Text variant="subtitle">Кнопки</Text>
          <Text variant="footnote" themeColor="textSecondary">
            Базовые варианты дизайн-системы.
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button title="Сформировать отчёт" icon={AnalyticsUpIcon} />
          <View style={styles.buttonRow}>
            <Button title="Вторичная" variant="secondary" />
            <Button title="Ссылка" variant="ghost" />
          </View>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardHead: {
    gap: 2,
    marginBottom: space.md,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space.lg,
  },
  buttons: {
    gap: space.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
});
