/**
 * Моки первичных документов учёта (портировано из веб-`mock/data.ts`).
 * Детерминированный генератор `rnd(seed)` повторяет веб 1:1, чтобы данные
 * совпадали между платформами.
 */
import type { AccountingDoc, DocType } from '@/data/types';

const counterparties = [
  'ООО «КанцТорг»', 'ООО «ПродСнаб»', 'АО «ТеплоЭнерго»', 'ООО «МедТехника»',
  'ИП Кузнецов А.В.', 'ООО «Чистый Дом»', 'ООО «АвтоТранс»', 'ООО «СтройРемонт»',
];

const operations = [
  { operation: 'Приобретение материальных запасов', kosgu: '346', kbk: '0709 0420100590 244', debit: '0 105 36 346', credit: '0 302 34 734' },
  { operation: 'Оплата коммунальных услуг', kosgu: '223', kbk: '0709 0420100590 247', debit: '0 401 20 223', credit: '0 302 23 734' },
  { operation: 'Приобретение основных средств', kosgu: '310', kbk: '0709 0420100590 244', debit: '0 101 34 310', credit: '0 302 31 734' },
  { operation: 'Услуги по содержанию имущества', kosgu: '225', kbk: '0709 0420100590 244', debit: '0 401 20 225', credit: '0 302 25 734' },
  { operation: 'Транспортные услуги', kosgu: '222', kbk: '0709 0420100590 244', debit: '0 401 20 222', credit: '0 302 22 734' },
];

const docTypes: DocType[] = ['Счёт', 'Акт', 'Накладная', 'Табель', 'Платёжное поручение'];

function rnd(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const accountingDocs: AccountingDoc[] = Array.from({ length: 48 }).map((_, i) => {
  const op = operations[i % operations.length];
  const inst = (i % 6) + 1;
  const amount = Math.round((2000 + rnd(i + 1) * 180000) / 10) * 10;
  const vat = Math.round(amount * 0.2 * 100) / 100;
  const conf = Math.round((78 + rnd(i + 3) * 21) * 10) / 10;
  const status: AccountingDoc['status'] = i % 7 === 0 ? 'confirmed' : i % 11 === 0 ? 'rejected' : 'pending';
  const cp = counterparties[i % counterparties.length];
  const day = (i % 27) + 1;
  return {
    id: i + 1,
    institutionId: inst,
    number: `№ ${1000 + i}`,
    date: `2026-05-${String(day).padStart(2, '0')}`,
    docType: docTypes[i % docTypes.length],
    counterparty: cp,
    amount,
    vat,
    status,
    confidence: conf,
    operation: op.operation,
    kosgu: op.kosgu,
    kbk: op.kbk,
    debit: op.debit,
    credit: op.credit,
    fields: [
      { name: 'Контрагент', value: cp, confidence: Math.round((90 + rnd(i + 5) * 9) * 10) / 10 },
      { name: 'ИНН', value: String(7700000000 + i * 13), confidence: Math.round((95 + rnd(i + 7) * 4) * 10) / 10 },
      { name: 'Сумма', value: `${amount.toLocaleString('ru-RU')} ₽`, confidence: Math.round((92 + rnd(i + 9) * 7) * 10) / 10 },
      { name: 'НДС 20%', value: `${vat.toLocaleString('ru-RU')} ₽`, confidence: Math.round((88 + rnd(i + 11) * 10) * 10) / 10 },
      { name: 'Дата', value: `${String(day).padStart(2, '0')}.05.2026`, confidence: Math.round((93 + rnd(i + 13) * 6) * 10) / 10 },
    ],
  };
});
