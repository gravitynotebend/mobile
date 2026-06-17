/**
 * Таб-бар для iOS.
 *
 * Фон НЕ задаётся намеренно — чтобы сохранить системный liquid glass таб-бар
 * (iOS 26+). Управляем только акцентом выделения и поведением сворачивания при
 * прокрутке. Иконки — SF Symbols.
 */
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { TAB_DEFS } from '@/components/tabs';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();
  return (
    <NativeTabs
      tintColor={theme.primary}
      minimizeBehavior="onScrollDown"
      iconColor={{ default: theme.textTertiary, selected: theme.primary }}
      labelStyle={{ selected: { color: theme.primary } }}>
      {TAB_DEFS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={tab.sf} md={tab.md} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
