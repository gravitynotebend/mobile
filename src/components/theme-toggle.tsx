/**
 * Переключатель темы (Система / Светлая / Тёмная) на сегментированном контроле.
 *
 * Обёрнут в `observer` и читает `themePref$` точечно, поэтому перерисовывается
 * только сам переключатель при смене предпочтения.
 */
import { observer, use$ } from '@legendapp/state/react';

import { ComputerIcon, Moon02Icon, Sun03Icon } from '@/icons';
import { setThemePref, themePref$, type ThemePref } from '@/state/theme';
import { Segmented, type SegmentedOption } from '@/ui/segmented';

const OPTIONS: SegmentedOption<ThemePref>[] = [
  { label: 'Система', value: 'system', icon: ComputerIcon },
  { label: 'Светлая', value: 'light', icon: Sun03Icon },
  { label: 'Тёмная', value: 'dark', icon: Moon02Icon },
];

export const ThemeToggle = observer(function ThemeToggle() {
  const pref = use$(themePref$);
  return <Segmented options={OPTIONS} value={pref} onChange={setThemePref} />;
});
