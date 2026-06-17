/**
 * Карточка текущего учреждения. Читает выбранное учреждение из стора точечно
 * (`observer` + `use$`). Открытие списка-выбора (bottom sheet) — следующий этап.
 */
import { observer, use$ } from '@legendapp/state/react';

import { Building03Icon } from '@/icons';
import { selected$ } from '@/state/institution';
import { Card } from '@/ui/card';
import { ListRow } from '@/ui/list-row';

export const InstitutionCard = observer(function InstitutionCard({ onPress }: { onPress?: () => void }) {
  const inst = use$(selected$);
  return (
    <Card padded={false}>
      <ListRow
        icon={Building03Icon}
        iconTone="primary"
        title={inst ? inst.shortName : 'Все учреждения'}
        subtitle={inst ? `ИНН ${inst.inn} · ${inst.type}` : 'Сводные данные по всем организациям'}
        showChevron
        onPress={onPress}
      />
    </Card>
  );
});
