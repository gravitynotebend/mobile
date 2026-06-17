/**
 * Каркас раздела для этапа «фундамент»: заголовок, карточка учреждения и блок
 * «что появится здесь». Реальное содержимое экранов портируется следующим этапом.
 */
import { type IconSvgElement } from '@hugeicons/react-native';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { InstitutionCard } from '@/components/institution-card';
import { useColorSchemeResolved } from '@/hooks/use-theme';
import { accents, type AccentName, radii, space, tint } from '@/theme/tokens';
import { Card } from '@/ui/card';
import { Icon } from '@/ui/icon';
import { Screen } from '@/ui/screen';
import { Tag } from '@/ui/tag';
import { Text } from '@/ui/text';

export type SectionScaffoldProps = {
  title: string;
  subtitle: string;
  icon: IconSvgElement;
  accent?: AccentName;
  summary: string;
  upcoming: string[];
  /** Скрыть быстрый переход к Ассистенту (например, на самом Ассистенте). */
  showAssistantShortcut?: boolean;
};

export function SectionScaffold({
  title,
  subtitle,
  icon,
  accent = 'primary',
  summary,
  upcoming,
  showAssistantShortcut = true,
}: SectionScaffoldProps) {
  const scheme = useColorSchemeResolved();
  const color = accents[scheme][accent];

  return (
    <Screen
      header={
        <AppHeader
          variant="section"
          title={title}
          subtitle={subtitle}
          showAssistantShortcut={showAssistantShortcut}
        />
      }>
      <InstitutionCard />

      <Card>
        <View style={styles.head}>
          <View style={[styles.tile, { backgroundColor: tint(color, scheme === 'dark' ? 0.22 : 0.12) }]}>
            <Icon icon={icon} size={24} color={color} />
          </View>
          <View style={styles.headTexts}>
            <View style={styles.titleRow}>
              <Text variant="subtitle">Раздел в разработке</Text>
              <Tag label="Скоро" tone="primary" />
            </View>
            <Text variant="footnote" themeColor="textSecondary">
              {summary}
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text variant="label" themeColor="textTertiary" style={styles.listTitle}>
          ЧТО ПОЯВИТСЯ ЗДЕСЬ
        </Text>
        <View style={styles.list}>
          {upcoming.map((item) => (
            <View key={item} style={styles.point}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text variant="body" themeColor="text" style={styles.pointText}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    gap: space.md,
    alignItems: 'center',
  },
  tile: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headTexts: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  listTitle: {
    marginBottom: space.sm,
    letterSpacing: 0.6,
  },
  list: {
    gap: space.md,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pointText: {
    flex: 1,
  },
});
