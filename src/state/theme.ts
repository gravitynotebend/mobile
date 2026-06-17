/**
 * Стор темы на legend-state.
 *
 * Хранит пользовательское предпочтение (`system | light | dark`) и сохраняет его
 * между запусками через AsyncStorage. Реальная светлая/тёмная схема вычисляется
 * в `useColorSchemeResolved` (см. `@/hooks/use-theme`) как комбинация системной
 * темы и этого предпочтения.
 */
import { observable } from '@legendapp/state';
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePref = 'system' | 'light' | 'dark';

export const themePref$ = observable<ThemePref>('system');

syncObservable(themePref$, {
  persist: {
    name: 'centrbalance.themePref',
    plugin: new ObservablePersistAsyncStorage({ AsyncStorage }),
  },
});

export function setThemePref(pref: ThemePref): void {
  themePref$.set(pref);
}
