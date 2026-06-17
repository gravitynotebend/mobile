/**
 * Раскладка вкладок. Сам таб-бар — в `@/components/app-tabs` с платформенными
 * расширениями (`.ios` — liquid glass, базовый — Android/прочее), без `Platform`.
 */
import AppTabs from '@/components/app-tabs';

export default function TabsLayout() {
  return <AppTabs />;
}
