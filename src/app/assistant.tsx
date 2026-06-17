import { SectionScaffold } from '@/components/section-scaffold';
import { BubbleChatIcon } from '@/icons';

export default function AssistantScreen() {
  return (
    <SectionScaffold
      title="Ассистент"
      subtitle="AI-помощник бухгалтера"
      icon={BubbleChatIcon}
      accent="violet"
      summary="Диалоговый помощник по учёту и нормативке с анимированным аватаром, как в вебе."
      upcoming={[
        'Чат с историей сообщений',
        'Анимированный аватар: улыбка → загрузка → ответ',
        'Быстрые подсказки и сценарии',
        'Ссылки на документы и операции',
      ]}
    />
  );
}
