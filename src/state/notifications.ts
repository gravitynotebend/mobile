/**
 * Стор уведомлений на legend-state.
 *
 * `unreadCount$` — вычисляемое наблюдаемое: бейдж в хедере подписывается точечно
 * через `use$(unreadCount$)` и перерисовывается только при изменении числа
 * непрочитанных, без лишних ререндеров остального дерева.
 */
import { batch, observable } from '@legendapp/state';

import { seedNotifications } from '@/data/notifications';

export const notifications$ = observable(seedNotifications);

export const unreadCount$ = observable<number>(
  () => notifications$.get().filter((n) => !n.read).length,
);

export function markRead(id: number): void {
  const index = notifications$.peek().findIndex((n) => n.id === id);
  if (index >= 0) {
    notifications$[index].read.set(true);
  }
}

export function markAllRead(): void {
  batch(() => {
    notifications$.peek().forEach((n, index) => {
      if (!n.read) {
        notifications$[index].read.set(true);
      }
    });
  });
}
