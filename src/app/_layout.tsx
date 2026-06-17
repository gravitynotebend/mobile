import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useColorSchemeResolved } from '@/hooks/use-theme';
import { Colors } from '@/theme/tokens';

function navThemeFor(scheme: 'light' | 'dark'): ReactNavigation.Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const c = Colors[scheme];
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.bgLayout,
      card: c.bgContainer,
      text: c.text,
      border: c.border,
    },
  };
}

export default function RootLayout() {
  const scheme = useColorSchemeResolved();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navThemeFor(scheme)}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
