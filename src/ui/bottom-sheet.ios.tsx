/**
 * Нижний лист (iOS) — нативный системный pageSheet через RN `Modal`.
 * Жесты, скруглённые углы и «резинка» обеспечиваются системой.
 */
import { type ReactNode } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { Icon } from '@/ui/icon';
import { PressableScale } from '@/ui/pressable-scale';
import { Text } from '@/ui/text';
import { Cancel01Icon } from '@/icons';
import { radii, space } from '@/theme/tokens';

export type AppBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapPoints?: (string | number)[];
};

export function AppBottomSheet({ visible, onClose, title, children }: AppBottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.root, { backgroundColor: theme.bgContainer }]}>
        <View style={[styles.header, { borderBottomColor: theme.borderSecondary }]}>
          <Text variant="headline">{title}</Text>
          <PressableScale onPress={onClose} style={[styles.close, { backgroundColor: theme.fillSecondary }]} hitSlop={8}>
            <Icon icon={Cancel01Icon} size={18} themeColor="textSecondary" />
          </PressableScale>
        </View>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space.xxl }]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  close: { width: 32, height: 32, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.lg, gap: space.md },
});
