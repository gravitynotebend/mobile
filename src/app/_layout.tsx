import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useColorSchemeResolved } from '@/hooks/use-theme';
import { Colors, font } from '@/theme/tokens';

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
      text: c.textHeading,
      border: c.border,
    },
  };
}

export default function RootLayout() {
  const scheme = useColorSchemeResolved();
  const c = Colors[scheme];
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navThemeFor(scheme)}>
        <AnimatedSplashOverlay />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: c.bgContainer },
            headerTitleStyle: { color: c.textHeading, fontWeight: font.weight.semibold },
            headerTintColor: c.primary,
            contentStyle: { backgroundColor: c.bgLayout },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ title: 'Уведомления' }} />
          <Stack.Screen name="profile" options={{ title: 'Профиль' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
