import { SectionScaffold } from '@/components/section-scaffold';
import { InvoiceIcon } from '@/icons';

export default function UchetScreen() {
  return (
    <SectionScaffold
      title="Учёт"
      subtitle="Первичные документы и проводки"
      icon={InvoiceIcon}
      accent="primary"
      summary="Реестр первичных документов с распознаванием, проводками и статусами согласования."
      upcoming={[
        'Список документов с фильтрами и поиском',
        'Предпросмотр файлов (PDF, изображения, таблицы)',
        'Карточка проводки: КОСГУ, КБК, дебет/кредит',
        'Статусы: подтверждён, на проверке, отклонён',
      ]}
    />
  );
}
