/**
 * Стор выбранного учреждения на legend-state.
 *
 * `selectedId$` — id выбранного учреждения или `'all'` («Все учреждения»).
 * Выбор сохраняется между запусками. Производное `selected$` отдаёт сам объект
 * учреждения (или `undefined` для «Все»), пересчитываясь только при смене id.
 */
import { observable } from '@legendapp/state';
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { institutions, type Institution } from '@/data/institutions';

export type InstitutionId = number | 'all';

export const selectedId$ = observable<InstitutionId>('all');

export const selected$ = observable<Institution | undefined>(() => {
  const id = selectedId$.get();
  return id === 'all' ? undefined : institutions.find((i) => i.id === id);
});

syncObservable(selectedId$, {
  persist: {
    name: 'centrbalance.institution',
    plugin: new ObservablePersistAsyncStorage({ AsyncStorage }),
  },
});

export function selectInstitution(id: InstitutionId): void {
  selectedId$.set(id);
}

export { institutions };
export type { Institution };
