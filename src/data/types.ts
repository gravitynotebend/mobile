/**
 * Доменные типы предметной области (портировано из веб-`types.ts`).
 * Учреждение (`Institution`) живёт в `@/data/institutions` и реэкспортируется,
 * чтобы оставаться единственным источником правды.
 */
export type { Institution } from '@/data/institutions';

export type ExtractedField = {
  name: string;
  value: string;
  confidence: number;
};

export type DocStatus = 'pending' | 'confirmed' | 'rejected';

export type DocType = 'Счёт' | 'Акт' | 'Накладная' | 'Табель' | 'Платёжное поручение';

export type AccountingDoc = {
  id: number;
  institutionId: number;
  number: string;
  date: string;
  docType: DocType;
  counterparty: string;
  amount: number;
  vat: number;
  status: DocStatus;
  confidence: number;
  operation: string;
  kosgu: string;
  kbk: string;
  debit: string;
  credit: string;
  fields: ExtractedField[];
};

export type RiskStatus = 'ok' | 'warning' | 'breach';
export type RiskSeverity = 'low' | 'medium' | 'high';

export type RiskItem = {
  id: number;
  institutionId: number;
  title: string;
  category: string;
  norm: number;
  fact: number;
  unit: string;
  status: RiskStatus;
  severity: RiskSeverity;
  updatedAt: string;
  report: string;
};

export type LetterStatus = 'new' | 'routed' | 'drafted' | 'sent';
export type LetterUrgency = 'Обычная' | 'Срочная' | 'Очень срочная';

export type Letter = {
  id: number;
  institutionId: number;
  number: string;
  date: string;
  sender: string;
  subject: string;
  urgency: LetterUrgency;
  department: string;
  assignee: string;
  status: LetterStatus;
  confidence: number;
  summary: string;
  draft: string;
};

export type RecentDocStatus = 'received' | 'processing' | 'ready' | 'sent' | 'archived';

export type RecentDocument = {
  id: number;
  name: string;
  ext: string;
  size: string;
  status: RecentDocStatus;
  from: string;
  to: string;
  date: string;
  institutionId: number;
  confidence?: number;
};
