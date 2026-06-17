/**
 * Рендер блоков ответа ассистента (порт веб-`BlockView` и вспомогательных
 * компонентов) на примитивах дизайн-системы. 9 видов блоков: text/refs/
 * checklist/diff/letter/options/confirm/success/followups.
 */
import { memo, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useAccent, useTheme } from '@/hooks/use-theme';
import { FileTypeIcon } from '@/components/file-type-icon';
import { Button } from '@/ui/button';
import { Icon } from '@/ui/icon';
import { PressableScale } from '@/ui/pressable-scale';
import { Text } from '@/ui/text';
import {
  ArrowRight01Icon,
  Building03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  SentIcon,
  SparklesIcon,
} from '@/icons';
import { radii, space, tint, type AccentPalette } from '@/theme/tokens';
import type { Block, DocRef, Suggestion } from './scenario';

export type BlockHandlers = {
  onSuggestion: (q: string) => void;
  onOpenDoc: (ref: DocRef) => void;
};

function Bubble({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.bubble, { backgroundColor: theme.bgElevated, borderColor: theme.borderSecondary }, style]}>
      {children}
    </View>
  );
}

export const BlockView = memo(function BlockView({ block, onSuggestion, onOpenDoc }: { block: Block } & BlockHandlers) {
  const theme = useTheme();
  const accent = useAccent();

  switch (block.kind) {
    case 'text':
      return (
        <Bubble>
          <Text variant="body">{block.text}</Text>
        </Bubble>
      );

    case 'refs':
      return (
        <Bubble>
          {block.title ? (
            <Text variant="caption" themeColor="textSecondary" style={styles.mb8}>
              {block.title}
            </Text>
          ) : null}
          <View style={styles.gap8}>
            {block.items.map((ref, i) => (
              <DocChip key={i} doc={ref} accent={accent} onOpen={onOpenDoc} />
            ))}
          </View>
        </Bubble>
      );

    case 'checklist':
      return (
        <Bubble>
          <View style={styles.gap10}>
            {block.items.map((it, i) => {
              const c = it.tone === 'warn' ? accent.amber : it.tone === 'ok' ? accent.green : theme.primary;
              return (
                <View key={i} style={styles.gap6}>
                  <View style={styles.checkRow}>
                    <View style={[styles.dotRing, { backgroundColor: tint(c, 0.16) }]}>
                      <View style={[styles.dot, { backgroundColor: c }]} />
                    </View>
                    <Text variant="body" style={styles.flex1}>
                      {it.text}
                    </Text>
                  </View>
                  {it.ref ? (
                    <View style={styles.checkRef}>
                      <DocChip doc={it.ref} accent={accent} onOpen={onOpenDoc} compact />
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </Bubble>
      );

    case 'diff':
      return (
        <Bubble>
          <Text variant="bodyStrong" style={styles.mb10}>
            {block.title}
          </Text>
          <View style={styles.gap8}>
            {block.rows.map((r, i) => (
              <View key={i} style={[styles.diffRow, { backgroundColor: theme.fillSecondary }]}>
                <Text variant="footnote" themeColor="textSecondary" style={styles.diffLabel}>
                  {r.label}
                </Text>
                <Text variant="footnote" themeColor="textTertiary" style={styles.strike}>
                  {r.before}
                </Text>
                <Icon icon={ArrowRight01Icon} size={14} themeColor="textTertiary" />
                <Text variant="footnote" color={accent.green} style={styles.bold}>
                  {r.after}
                </Text>
              </View>
            ))}
          </View>
        </Bubble>
      );

    case 'letter':
      return (
        <Bubble>
          <View style={[styles.letterHead, { borderBottomColor: theme.borderSecondary }]}>
            <View style={[styles.letterTile, { backgroundColor: tint(theme.primary, 0.12) }]}>
              <Icon icon={Mail01Icon} size={16} themeColor="primary" />
            </View>
            <View style={styles.flex1}>
              <Text variant="bodyStrong">{block.subject}</Text>
              <Text variant="caption" themeColor="textTertiary">
                Кому: {block.to}
              </Text>
            </View>
          </View>
          <Text variant="footnote" themeColor="textSecondary" style={styles.letterBody}>
            {block.body}
          </Text>
        </Bubble>
      );

    case 'options': {
      const single = block.items.length === 1;
      return (
        <Bubble>
          {block.prompt ? (
            <Text variant="label" style={styles.mb10}>
              {block.prompt}
            </Text>
          ) : null}
          {single ? (
            <Button
              title={block.items[0].label}
              icon={SentIcon}
              onPress={() => onSuggestion(block.items[0].query)}
              style={styles.selfStart}
            />
          ) : (
            <View style={styles.gap8}>
              {block.items.map((s, i) => (
                <OptionButton key={i} index={i} suggestion={s} onPress={onSuggestion} />
              ))}
            </View>
          )}
        </Bubble>
      );
    }

    case 'confirm':
      return (
        <Bubble>
          <Button
            title={block.label}
            icon={CheckmarkCircle02Icon}
            onPress={() => onSuggestion(block.query)}
            style={styles.selfStart}
          />
          {block.note ? (
            <Text variant="caption" themeColor="textTertiary" style={styles.mt8}>
              {block.note}
            </Text>
          ) : null}
        </Bubble>
      );

    case 'success':
      return (
        <Animated.View
          entering={FadeIn.duration(260)}
          style={[styles.bubble, { backgroundColor: tint(accent.green, 0.08), borderColor: tint(accent.green, 0.3) }]}>
          <View style={styles.successRow}>
            <Icon icon={CheckmarkCircle02Icon} size={20} color={accent.green} />
            <View style={styles.flex1}>
              <Text variant="bodyStrong">{block.title}</Text>
              {block.text ? (
                <Text variant="footnote" themeColor="textSecondary" style={styles.mt2}>
                  {block.text}
                </Text>
              ) : null}
            </View>
          </View>
        </Animated.View>
      );

    case 'followups':
      return (
        <View style={styles.followups}>
          {block.items.map((s, i) => (
            <FollowupChip key={i} suggestion={s} onPress={onSuggestion} />
          ))}
        </View>
      );

    default:
      return null;
  }
});

export const DocChip = memo(function DocChip({
  doc,
  accent,
  onOpen,
  compact = false,
}: {
  doc: DocRef;
  accent: AccentPalette;
  onOpen: (ref: DocRef) => void;
  compact?: boolean;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={() => onOpen(doc)}
      style={[
        styles.docChip,
        { borderColor: theme.borderSecondary, backgroundColor: theme.bgContainer, alignSelf: compact ? 'flex-start' : 'stretch' },
      ]}>
      <FileTypeIcon ext={doc.ext} size={compact ? 18 : 26} />
      <View style={styles.flex1}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {doc.name}
        </Text>
        {doc.hint ? (
          <Text variant="caption" themeColor="textTertiary">
            {doc.hint}
          </Text>
        ) : null}
      </View>
      <View style={styles.openRow}>
        <Text variant="caption" color={accent.blue} style={styles.bold}>
          Открыть
        </Text>
        <Icon icon={ArrowRight01Icon} size={14} color={accent.blue} />
      </View>
    </PressableScale>
  );
});

const OptionButton = memo(function OptionButton({
  suggestion,
  index,
  onPress,
}: {
  suggestion: Suggestion;
  index: number;
  onPress: (q: string) => void;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={() => onPress(suggestion.query)}
      style={[styles.optBtn, { borderColor: theme.borderSecondary, backgroundColor: theme.bgContainer }]}>
      <View style={[styles.optNum, { backgroundColor: tint(theme.primary, 0.1) }]}>
        <Text variant="caption" color={theme.primary} style={styles.bold}>
          {index + 1}
        </Text>
      </View>
      <Text variant="label" style={styles.flex1}>
        {suggestion.label}
      </Text>
      <Icon icon={ArrowRight01Icon} size={16} themeColor="textTertiary" />
    </PressableScale>
  );
});

const FollowupChip = memo(function FollowupChip({
  suggestion,
  onPress,
}: {
  suggestion: Suggestion;
  onPress: (q: string) => void;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={() => onPress(suggestion.query)}
      style={[styles.followChip, { borderColor: theme.borderSecondary, backgroundColor: theme.bgContainer }]}>
      <Icon icon={SparklesIcon} size={13} themeColor="primary" />
      <Text variant="caption" themeColor="textSecondary">
        {suggestion.label}
      </Text>
    </PressableScale>
  );
});

export const AttachChip = memo(function AttachChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  const theme = useTheme();
  const ext = name.includes('.') ? name.split('.').pop() ?? '' : '';
  return (
    <View style={[styles.attachChip, { borderColor: theme.borderSecondary, backgroundColor: theme.fillSecondary }]}>
      <FileTypeIcon ext={ext} size={16} />
      <Text variant="caption" numberOfLines={1} style={styles.attachName}>
        {name}
      </Text>
      <PressableScale onPress={onRemove} hitSlop={6}>
        <Icon icon={Cancel01Icon} size={13} themeColor="textTertiary" />
      </PressableScale>
    </View>
  );
});

export const UserBubble = memo(function UserBubble({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.userRow}>
      <View style={[styles.userBubble, { backgroundColor: theme.primary }]}>
        <Text variant="body" color={theme.onPrimary}>
          {text}
        </Text>
      </View>
    </View>
  );
});

export const ContextNotice = memo(function ContextNotice({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.contextRow}>
      <Icon icon={Building03Icon} size={16} themeColor="primary" />
      <Text variant="footnote" color={theme.primary} style={styles.flex1}>
        {text}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  bubble: {
    borderWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 4,
    borderTopRightRadius: radii.xl,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    padding: space.md,
  },
  flex1: { flex: 1, minWidth: 0 },
  gap6: { gap: 6 },
  gap8: { gap: space.sm },
  gap10: { gap: 10 },
  mb8: { marginBottom: space.sm },
  mb10: { marginBottom: 10 },
  mt2: { marginTop: 2 },
  mt8: { marginTop: space.sm },
  bold: { fontWeight: '700' },
  selfStart: { alignSelf: 'flex-start' },
  checkRow: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  dotRing: { width: 13, height: 13, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  dot: { width: 7, height: 7, borderRadius: radii.pill },
  checkRef: { paddingLeft: 22 },
  diffRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap', paddingVertical: space.sm, paddingHorizontal: 10, borderRadius: radii.md },
  diffLabel: { minWidth: 120 },
  strike: { textDecorationLine: 'line-through' },
  letterHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: 10, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  letterTile: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  letterBody: { lineHeight: 21 },
  successRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  followups: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  docChip: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: radii.md, borderWidth: StyleSheet.hairlineWidth },
  openRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  optBtn: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: space.md, borderRadius: radii.lg, borderWidth: StyleSheet.hairlineWidth },
  optNum: { width: 26, height: 26, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  followChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: space.md, borderRadius: radii.pill, borderWidth: StyleSheet.hairlineWidth },
  attachChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 5, paddingHorizontal: space.sm, borderRadius: 9, borderWidth: StyleSheet.hairlineWidth, maxWidth: 230 },
  attachName: { flex: 1 },
  userRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  userBubble: { maxWidth: '82%', paddingVertical: 10, paddingHorizontal: 14, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, borderBottomLeftRadius: radii.xl, borderBottomRightRadius: 4 },
  contextRow: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start', paddingHorizontal: 2, paddingVertical: 4 },
});
