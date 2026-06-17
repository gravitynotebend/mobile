import { SectionScaffold } from '@/components/section-scaffold';
import { SecurityCheckIcon } from '@/icons';

export default function ControlScreen() {
  return (
    <SectionScaffold
      title="Контроль"
      subtitle="Риски и внутренние проверки"
      icon={SecurityCheckIcon}
      accent="amber"
      summary="Автоматические проверки документов и операций с выявлением рисков и рекомендациями."
      upcoming={[
        'Лента выявленных рисков по уровням',
        'Правила контроля и их срабатывания',
        'Рекомендации по устранению нарушений',
        'История проверок по учреждению',
      ]}
    />
  );
}
