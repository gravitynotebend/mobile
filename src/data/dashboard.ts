/** Сводные данные для экрана «Обзор»: тренд обработки и последние документы. */
import type { RecentDocument } from '@/data/types';

export type TrendPoint = { month: string; processed: number; confirmed: number };

export const documentsTrend: TrendPoint[] = [
  { month: 'Дек', processed: 820, confirmed: 790 },
  { month: 'Янв', processed: 932, confirmed: 910 },
  { month: 'Фев', processed: 901, confirmed: 880 },
  { month: 'Мар', processed: 1290, confirmed: 1240 },
  { month: 'Апр', processed: 1330, confirmed: 1305 },
  { month: 'Май', processed: 1620, confirmed: 1588 },
];

export const recentDocuments: RecentDocument[] = [
  { id: 101, name: 'Счёт на канцелярию', ext: 'pdf', size: '245 КБ', status: 'ready', from: 'ООО «КанцТорг»', to: 'Бухгалтерия', date: '2026-05-28', institutionId: 1, confidence: 96.2 },
  { id: 102, name: 'Акт выполненных работ', ext: 'docx', size: '1.2 МБ', status: 'processing', from: 'ООО «СтройРемонт»', to: 'Бухгалтерия', date: '2026-05-28', institutionId: 6, confidence: 91.4 },
  { id: 103, name: 'Реестр начислений май', ext: 'xlsx', size: '3.8 МБ', status: 'ready', from: 'Отдел кадров', to: 'Бухгалтерия', date: '2026-05-27', institutionId: 2, confidence: 98.1 },
  { id: 104, name: 'Путевые листы 15–28.05', ext: 'pdf', size: '890 КБ', status: 'received', from: 'Гараж', to: 'Бухгалтерия', date: '2026-05-27', institutionId: 3 },
  { id: 105, name: 'Договор поставки продуктов', ext: 'docx', size: '2.1 МБ', status: 'sent', from: 'Бухгалтерия', to: 'ООО «ПродСнаб»', date: '2026-05-26', institutionId: 1 },
  { id: 106, name: 'Смета на ремонт кровли', ext: 'xlsx', size: '5.4 МБ', status: 'ready', from: 'ООО «СтройРемонт»', to: 'Бухгалтерия', date: '2026-05-26', institutionId: 4, confidence: 94.7 },
  { id: 107, name: 'Журнал бракеража', ext: 'pdf', size: '320 КБ', status: 'archived', from: 'Пищеблок', to: 'Роспотребнадзор', date: '2026-05-24', institutionId: 1 },
  { id: 108, name: 'Заявка на спартакиаду', ext: 'docx', size: '780 КБ', status: 'processing', from: 'Комитет по спорту', to: 'Спортивный отдел', date: '2026-05-23', institutionId: 5, confidence: 89.3 },
  { id: 109, name: 'Отчёт по нацпроекту', ext: 'pptx', size: '12.3 МБ', status: 'received', from: 'Управление образования', to: 'Учебная часть', date: '2026-05-27', institutionId: 2 },
  { id: 110, name: 'Сведения о содержании дворов', ext: 'csv', size: '156 КБ', status: 'ready', from: 'Отдел ЖКХ', to: 'Отдел благоустройства', date: '2026-05-28', institutionId: 6, confidence: 92.0 },
];
