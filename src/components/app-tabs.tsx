/**
 * Таб-бар (Android и прочие нативные цели).
 *
 * Кастомный анимированный таб-бар на базе `Tabs` из expo-router.
 * Иконки — HugeIcons, активная вкладка выделяется цветом и фоновым пиллом.
 */
import { Tabs } from 'expo-router';

import { AnimatedTabBar } from '@/components/animated-tab-bar';
import { TAB_DEFS } from '@/components/tabs';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AnimatedTabBar {...props} />}>
      {TAB_DEFS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
      ))}
    </Tabs>
  );
}
