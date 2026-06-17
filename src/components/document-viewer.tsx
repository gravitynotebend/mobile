/**
 * Просмотрщик документов (мобильная версия).
 *
 * В вебе тяжёлые рендеры (react-pdf / docx-preview / exceljs) грузят реальные
 * файлы. На мобильном показываем аккуратную «факсимиле»-страницу: бумажный лист
 * с шапкой, заголовком и содержимым в стиле формата (текст для PDF/Word, сетка
 * для таблиц, превью для изображений) + подсказку «где смотреть» из ассистента.
 */
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { FileTypeIcon, fileTypeColor } from '@/components/file-type-icon';
import { AppBottomSheet } from '@/ui/bottom-sheet';
import { Icon } from '@/ui/icon';
import { Text } from '@/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { Image01Icon } from '@/icons';
import { radii, space, tint } from '@/theme/tokens';

export type DocViewerTarget = { name: string; ext: string; page?: number; hint?: string };

type DocKind = 'pdf' | 'docx' | 'xlsx' | 'image' | 'other';

function kindForExt(ext: string): DocKind {
  const e = ext.toLowerCase();
  if (e === 'pdf') return 'pdf';
  if (e === 'doc' || e === 'docx') return 'docx';
  if (e === 'xls' || e === 'xlsx' || e === 'csv') return 'xlsx';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tiff', 'svg'].includes(e)) return 'image';
  return 'other';
}

export const DocumentViewer = memo(function DocumentViewer({
  target,
  onClose,
}: {
  target: DocViewerTarget | null;
  onClose: () => void;
}) {
  return (
    <AppBottomSheet visible={!!target} onClose={onClose} title={target ? `${target.name}.${target.ext}` : ''}>
      {target ? <Facsimile target={target} /> : null}
    </AppBottomSheet>
  );
});

function Facsimile({ target }: { target: DocViewerTarget }) {
  const theme = useTheme();
  const kind = kindForExt(target.ext);
  const brand = fileTypeColor(target.ext);

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <FileTypeIcon ext={target.ext} size={22} />
        <Text variant="bodyStrong" numberOfLines={1} style={styles.flex1}>
          {target.name}
        </Text>
        <View style={[styles.extTag, { backgroundColor: tint(brand, 0.16) }]}>
          <Text variant="caption" color={brand} style={styles.extTagText}>
            {target.ext.toUpperCase()}
          </Text>
        </View>
      </View>

      {target.hint ? (
        <View style={[styles.hint, { backgroundColor: tint(theme.primary, 0.1) }]}>
          <Text variant="caption" themeColor="primary">
            Где смотреть: {target.hint}
          </Text>
        </View>
      ) : null}

      <View style={[styles.page, { backgroundColor: '#FFFFFF', borderColor: theme.borderSecondary }]}>
        {kind === 'xlsx' ? (
          <SheetFacsimile brand={brand} />
        ) : kind === 'image' ? (
          <ImageFacsimile brand={brand} />
        ) : (
          <PaperFacsimile brand={brand} multiPage={kind === 'pdf' || kind === 'docx'} page={target.page} />
        )}
      </View>
    </View>
  );
}

/** Лист с текстом — для PDF/Word. */
function PaperFacsimile({ brand, multiPage, page }: { brand: string; multiPage: boolean; page?: number }) {
  const lineWidths = ['92%', '78%', '88%', '64%', '95%', '70%', '84%'];
  return (
    <View style={styles.paper}>
      <View style={[styles.docTitleBar, { backgroundColor: tint(brand, 0.16) }]} />
      <View style={[styles.bar, { width: '46%', height: 12, backgroundColor: '#1E2530' }]} />
      <View style={styles.paperGap} />
      {lineWidths.map((w, i) => (
        <View key={i} style={[styles.bar, { width: w as `${number}%`, backgroundColor: '#C9CFDA' }]} />
      ))}
      <View style={styles.paperBlock}>
        {['58%', '72%', '40%'].map((w, i) => (
          <View key={i} style={[styles.bar, { width: w as `${number}%`, backgroundColor: '#D8DDE6' }]} />
        ))}
      </View>
      {multiPage ? (
        <Text variant="caption" themeColor="textTertiary" style={styles.pageFoot}>
          Стр. {page && page > 0 ? page : 1}
        </Text>
      ) : null}
    </View>
  );
}

/** Сетка ячеек — для Excel/CSV. */
function SheetFacsimile({ brand }: { brand: string }) {
  const cols = 4;
  const rows = 7;
  return (
    <View style={styles.sheet}>
      {Array.from({ length: rows }).map((_, r) => (
        <View key={r} style={styles.sheetRow}>
          {Array.from({ length: cols }).map((_, c) => (
            <View
              key={c}
              style={[
                styles.cell,
                { borderColor: '#E3E7EE' },
                r === 0 && { backgroundColor: tint(brand, 0.18) },
              ]}>
              <View style={[styles.cellBar, { backgroundColor: r === 0 ? brand : '#CDD3DC' }]} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** Превью изображения. */
function ImageFacsimile({ brand }: { brand: string }) {
  return (
    <View style={[styles.imageBox, { backgroundColor: tint(brand, 0.1), borderColor: tint(brand, 0.3) }]}>
      <Icon icon={Image01Icon} size={40} color={brand} />
      <Text variant="caption" themeColor="textTertiary">
        Оригинал документа
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  flex1: { flex: 1, minWidth: 0 },
  hint: { paddingVertical: 7, paddingHorizontal: space.md, borderRadius: radii.md },
  page: { borderRadius: radii.md, borderWidth: StyleSheet.hairlineWidth, padding: space.lg, minHeight: 320 },
  paper: { gap: 9 },
  docTitleBar: { height: 6, width: 64, borderRadius: radii.pill, marginBottom: space.sm },
  bar: { height: 9, borderRadius: 3 },
  paperGap: { height: 2 },
  extTag: { borderRadius: radii.pill, paddingHorizontal: 9, paddingVertical: 2 },
  extTagText: { fontWeight: '600' },
  paperBlock: { gap: 9, marginTop: space.lg },
  pageFoot: { textAlign: 'center', marginTop: space.xl },
  sheet: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#E3E7EE', borderRadius: radii.sm, overflow: 'hidden' },
  sheetRow: { flexDirection: 'row' },
  cell: { flex: 1, height: 34, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  cellBar: { height: 7, borderRadius: 2, width: '70%' },
  imageBox: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radii.md, minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: space.sm },
});
