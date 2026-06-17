/**
 * Уведомления (моки, портировано из веб-версии `NotificationsBell`).
 *
 * Тип уведомления различается иконкой, а не цветом — единый синий акцент для
 * большинства, янтарный только для «риска», чтобы аномалии были заметны сразу.
 */
import { type IconSvgElement } from '@hugeicons/react-native';

import { InvoiceIcon, Mail01Icon, SecurityCheckIcon, SparklesIcon } from '@/icons';
import { type AccentName } from '@/theme/tokens';

export type NotifType = 'mail' | 'risk' | 'doc' | 'system';
export type NotifGroup = 'today' | 'yesterday' | 'earlier';

/** Куда ведёт уведомление — только существующие маршруты вкладок. */
export type NotifTarget = '/uchet' | '/control' | '/docflow';

export type Notif = {
  id: number;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  group: NotifGroup;
  read: boolean;
  to?: NotifTarget;
};

export const typeMeta: Record<NotifType, { icon: IconSvgElement; accent: AccentName }> = {
  mail: { icon: Mail01Icon, accent: 'blue' },
  doc: { icon: InvoiceIcon, accent: 'blue' },
  system: { icon: SparklesIcon, accent: 'blue' },
  risk: { icon: SecurityCheckIcon, accent: 'amber' },
};

export const groupLabels: Record<NotifGroup, string> = {
  today: 'Сегодня',
  yesterday: 'Вчера',
  earlier: 'Ранее',
};

export const groupOrder: NotifGroup[] = ['today', 'yesterday', 'earlier'];

export const seedNotifications: Notif[] = [
  {
    id: 1,
    type: 'mail',
    title: 'Новое срочное письмо',
    desc: 'Управление образования: отчёт по нацпроекту «Образование», срок ответа — 3 рабочих дня.',
    time: '12 мин назад',
    group: 'today',
    read: false,
    to: '/docflow',
  },
  {
    id: 2,
    type: 'doc',
    title: 'Документы готовы к подтверждению',
    desc: 'Распознано 8 новых счетов — черновики проводок и КОСГУ уже подготовлены.',
    time: '40 мин назад',
    group: 'today',
    read: false,
    to: '/uchet',
  },
  {
    id: 3,
    type: 'risk',
    title: 'Превышение лимита ГСМ',
    desc: 'Поликлиника №3: списание 1 640 л при лимите 1 500 л (+9,3%).',
    time: '1 ч назад',
    group: 'today',
    read: false,
    to: '/control',
  },
  {
    id: 4,
    type: 'system',
    title: 'Отчёт сформирован',
    desc: 'Риск-ориентированный отчёт за май готов к выгрузке в PDF.',
    time: '2 ч назад',
    group: 'today',
    read: false,
    to: '/control',
  },
  {
    id: 5,
    type: 'mail',
    title: 'Ответ отправлен',
    desc: 'Отдел культуры: план мероприятий ко Дню города направлен адресату.',
    time: 'Вчера, 16:20',
    group: 'yesterday',
    read: true,
    to: '/docflow',
  },
  {
    id: 6,
    type: 'doc',
    title: 'Проводка подтверждена',
    desc: 'Документ № 1023 проведён в учёте и отправлен в реестр.',
    time: 'Вчера, 11:05',
    group: 'yesterday',
    read: true,
    to: '/uchet',
  },
  {
    id: 7,
    type: 'system',
    title: 'Обновление платформы',
    desc: 'Добавлены тёмная тема и новые рабочие виджеты на странице «Обзор».',
    time: '14 мая',
    group: 'earlier',
    read: true,
  },
];
