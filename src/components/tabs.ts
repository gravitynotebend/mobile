/**
 * Определения вкладок (5 разделов веб-приложения «ЦентрБаланс»).
 *
 * Иконки — HugeIcons (@hugeicons/react-native), единые для iOS и Android.
 * Короткие подписи для таб-бара; полные названия разделов — в заголовках экранов.
 */
import type { IconSvgElement } from '@hugeicons/react-native';

import {
  DashboardSquareIcon,
  InvoiceIcon,
  Mail01Icon,
  SecurityCheckIcon,
} from '@/icons';

export type TabDef = {
  name: string;
  label: string;
  icon: IconSvgElement;
};

export const TAB_DEFS = [
  { name: 'index', label: 'Обзор', icon: DashboardSquareIcon },
  { name: 'uchet', label: 'Учёт', icon: InvoiceIcon },
  { name: 'control', label: 'Контроль', icon: SecurityCheckIcon },
  { name: 'docflow', label: 'Документооборот', icon: Mail01Icon },
] as const satisfies readonly TabDef[];
