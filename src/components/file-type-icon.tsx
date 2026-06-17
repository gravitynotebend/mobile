/**
 * Иконка типа файла на HugeIcons с бренд-цветами (RN-замена веб-`FileTypeIcon`,
 * который использовал офлайн vscode-icons через `@iconify/react`).
 * Цвета совпадают с вебом: PDF #E03C31, Word #2B579A, Excel #217346, и т.д.
 */
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/ui/text';
import { Icon } from '@/ui/icon';
import {
  Csv01Icon,
  Doc01Icon,
  File01Icon,
  Image01Icon,
  Pdf01Icon,
  Ppt01Icon,
  Txt01Icon,
  Xls01Icon,
} from '@/icons';
import type { IconSvgElement } from '@hugeicons/react-native';
import { radii } from '@/theme/tokens';

type FileTypeMeta = { icon: IconSvgElement; label: string; color: string };

const extMap: Record<string, FileTypeMeta> = {
  pdf: { icon: Pdf01Icon, label: 'PDF', color: '#E03C31' },
  doc: { icon: Doc01Icon, label: 'DOC', color: '#2B579A' },
  docx: { icon: Doc01Icon, label: 'DOCX', color: '#2B579A' },
  xls: { icon: Xls01Icon, label: 'XLS', color: '#217346' },
  xlsx: { icon: Xls01Icon, label: 'XLSX', color: '#217346' },
  csv: { icon: Csv01Icon, label: 'CSV', color: '#217346' },
  ppt: { icon: Ppt01Icon, label: 'PPT', color: '#D24726' },
  pptx: { icon: Ppt01Icon, label: 'PPTX', color: '#D24726' },
  jpg: { icon: Image01Icon, label: 'JPG', color: '#4C8BF5' },
  jpeg: { icon: Image01Icon, label: 'JPEG', color: '#4C8BF5' },
  png: { icon: Image01Icon, label: 'PNG', color: '#4C8BF5' },
  gif: { icon: Image01Icon, label: 'GIF', color: '#4C8BF5' },
  webp: { icon: Image01Icon, label: 'WEBP', color: '#4C8BF5' },
  svg: { icon: Image01Icon, label: 'SVG', color: '#FFB13B' },
  txt: { icon: Txt01Icon, label: 'TXT', color: '#6B7280' },
  rtf: { icon: Txt01Icon, label: 'RTF', color: '#6B7280' },
  xml: { icon: Txt01Icon, label: 'XML', color: '#E44D26' },
  json: { icon: Txt01Icon, label: 'JSON', color: '#6B7280' },
};

const defaultMeta: FileTypeMeta = { icon: File01Icon, label: 'FILE', color: '#6B7280' };

function resolveExt(ext: string): FileTypeMeta {
  return extMap[ext.toLowerCase()] ?? defaultMeta;
}

/** Бренд-цвет расширения (фон, точки и т.п.). */
export function fileTypeColor(ext: string): string {
  return resolveExt(ext).color;
}

export type FileTypeIconProps = {
  ext: string;
  size?: number;
  /** Показать подпись с расширением рядом с иконкой. */
  badge?: boolean;
  /** Отрисовать иконку на скруглённой плитке в бренд-цвете. */
  tile?: boolean;
};

export const FileTypeIcon = memo(function FileTypeIcon({
  ext,
  size = 22,
  badge = false,
  tile = false,
}: FileTypeIconProps) {
  const meta = resolveExt(ext);

  const glyph = tile ? (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: radii.sm, backgroundColor: meta.color },
      ]}
    >
      <Icon icon={meta.icon} size={Math.round(size * 0.58)} color="#FFFFFF" strokeWidth={2} />
    </View>
  ) : (
    <Icon icon={meta.icon} size={size} color={meta.color} strokeWidth={1.9} />
  );

  if (!badge) return glyph;

  return (
    <View style={styles.row}>
      {glyph}
      <Text variant="caption" color={meta.color} style={styles.label}>
        {meta.label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  tile: { alignItems: 'center', justifyContent: 'center' },
});
