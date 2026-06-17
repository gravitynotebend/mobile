import { SectionScaffold } from '@/components/section-scaffold';
import { Mail01Icon } from '@/icons';

export default function DocflowScreen() {
  return (
    <SectionScaffold
      title="Документооборот"
      subtitle="Входящие и исходящие письма"
      icon={Mail01Icon}
      accent="blue"
      summary="Корреспонденция между учреждениями и контрагентами с вложениями и статусами."
      upcoming={[
        'Входящие и исходящие письма',
        'Вложения с предпросмотром файлов',
        'Статусы обработки и ответственные',
        'Поиск по теме, отправителю и дате',
      ]}
    />
  );
}
