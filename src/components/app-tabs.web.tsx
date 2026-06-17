/**
 * Таб-бар для web: верхняя «таблетка» с брендом и пятью разделами на
 * `expo-router/ui`. Иконки — те же HugeIcons, что и на нативе/вебе оригинала.
 */
import { type IconSvgElement } from '@hugeicons/react-native';
import { Tabs, TabList, TabTrigger, TabSlot, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  BubbleChatIcon,
  DashboardSquareIcon,
  InvoiceIcon,
  Mail01Icon,
  SecurityCheckIcon,
} from '@/icons';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth } from '@/constants/theme';
import { radii, space } from '@/theme/tokens';
import { Icon } from '@/ui/icon';
import { Text } from '@/ui/text';

export default function AppTabs() {
  const theme = useTheme();
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View style={styles.tabListContainer}>
          <View
            style={[
              styles.innerContainer,
              { backgroundColor: theme.bgContainer, borderColor: theme.borderSecondary },
            ]}>
            <Text variant="bodyStrong" themeColor="primary" style={styles.brandText}>
              ЦентрБаланс
            </Text>
            <TabTrigger name="index" href="/" asChild>
              <TabButton icon={DashboardSquareIcon}>Обзор</TabButton>
            </TabTrigger>
            <TabTrigger name="uchet" href="/uchet" asChild>
              <TabButton icon={InvoiceIcon}>Учёт</TabButton>
            </TabTrigger>
            <TabTrigger name="control" href="/control" asChild>
              <TabButton icon={SecurityCheckIcon}>Контроль</TabButton>
            </TabTrigger>
            <TabTrigger name="docflow" href="/docflow" asChild>
              <TabButton icon={Mail01Icon}>Письма</TabButton>
            </TabTrigger>
            <TabTrigger name="assistant" href="/assistant" asChild>
              <TabButton icon={BubbleChatIcon}>Ассистент</TabButton>
            </TabTrigger>
          </View>
        </View>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: IconSvgElement };

export function TabButton({ children, icon, isFocused, ...props }: TabButtonProps) {
  const theme = useTheme();
  return (
    <Pressable {...props} style={({ pressed }) => [pressed && styles.pressed]}>
      <View
        style={[
          styles.tabButtonView,
          isFocused && { backgroundColor: theme.primarySoft },
        ]}>
        <Icon icon={icon} size={18} color={isFocused ? theme.primary : theme.textSecondary} />
        <Text variant="label" color={isFocused ? theme.primary : theme.textSecondary}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: space.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: space.sm,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
    borderRadius: radii.md,
  },
});
