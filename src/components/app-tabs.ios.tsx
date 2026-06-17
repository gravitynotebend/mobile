/**
 * Таб-бар для iOS.
 *
 * Фон не задаётся намеренно — чтобы сохранить системный полупрозрачный
 * таб-бар iOS. Перешли со `unstable-native-tabs` на стандартный `Tabs`,
 * чтобы использовать HugeIcons через `tabBarIcon`.
 */
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tabs } from 'expo-router';

import { TAB_DEFS } from '@/components/tabs';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
      }}>
      {TAB_DEFS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, size }) => (
              <HugeiconsIcon icon={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
