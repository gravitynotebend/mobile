/**
 * Нижний лист (Android / default) на `@gorhom/bottom-sheet`.
 * Управляется пропом `visible`. Анимация — короткий timing (без «желейных»
 * пружин), как просили. iOS-вариант — нативный pageSheet (`bottom-sheet.ios`).
 */
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetTimingConfigs,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Easing } from 'react-native-reanimated';

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

export function AppBottomSheet({ visible, onClose, title, children, snapPoints }: AppBottomSheetProps) {
  const theme = useTheme();
  const ref = useRef<BottomSheetModal>(null);
  const points = useMemo(() => snapPoints ?? ['88%'], [snapPoints]);
  const animationConfigs = useBottomSheetTimingConfigs({ duration: 280, easing: Easing.out(Easing.cubic) });

  useEffect(() => {
    if (visible) ref.current?.present();
    else ref.current?.dismiss();
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" opacity={0.5} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={points}
      onDismiss={onClose}
      enableDynamicSizing={false}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: theme.border, width: 40 }}
      backgroundStyle={{ backgroundColor: theme.bgContainer, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl }}>
      <View style={[styles.header, { borderBottomColor: theme.borderSecondary }]}>
        <Text variant="headline">{title}</Text>
        <PressableScale onPress={onClose} style={[styles.close, { backgroundColor: theme.fillSecondary }]} hitSlop={8}>
          <Icon icon={Cancel01Icon} size={18} themeColor="textSecondary" />
        </PressableScale>
      </View>
      <BottomSheetScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    paddingTop: space.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  close: { width: 32, height: 32, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.lg, gap: space.md, paddingBottom: space.xxl },
});
