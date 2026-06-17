/**
 * Таб-бар по умолчанию (Android и прочие нативные цели).
 *
 * Сплошной фон из темы + индикатор и ripple в фирменном цвете. Версия для iOS
 * с liquid glass — в `app-tabs.ios.tsx`.
 */
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { TAB_DEFS } from '@/components/tabs';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();
  return (
    <NativeTabs
      backgroundColor={theme.bgContainer}
      indicatorColor={theme.primarySoft}
      rippleColor={theme.primarySoft}
      tintColor={theme.primary}
      iconColor={{ default: theme.textTertiary, selected: theme.primary }}
      labelStyle={{
        default: { color: theme.textTertiary },
        selected: { color: theme.primary },
      }}>
      {TAB_DEFS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={tab.sf} md={tab.md} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
