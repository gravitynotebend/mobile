/**
 * Экран ассистента (порт веб-страницы `/assistant`).
 *
 * Диалоговый помощник: лента сообщений (legend-list), живой аватар, стадии
 * «размышления», блоки ответа, прикрепления, история диалогов и предпросмотр
 * документов. Контекст подхватывается из выбранного учреждения через
 * legend-state (`use$`), сообщение о смене контекста добавляется в ленту.
 *
 * Анимации — Reanimated 4: короткие чёткие переходы (FadeIn/FadeInDown,
 * пульсация точек), без «желейных» пружин.
 */
import { observer, use$ } from '@legendapp/state/react';
import { LegendList, type LegendListRef, type LegendListRenderItemProps } from '@legendapp/list/react-native';
import { useRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DocumentViewer, type DocViewerTarget } from '@/components/document-viewer';
import { KeyboardBehavior } from '@/constants/platform';
import { useTheme } from '@/hooks/use-theme';
import {
  ArrowLeft01Icon,
  Attachment01Icon,
  Building03Icon,
  Clock01Icon,
  InformationCircleIcon,
  RefreshIcon,
  Search01Icon,
  SentIcon,
} from '@/icons';
import { institutions } from '@/data/institutions';
import { selected$, selectedId$ } from '@/state/institution';
import { AppBottomSheet } from '@/ui/bottom-sheet';
import { Icon } from '@/ui/icon';
import { PressableScale } from '@/ui/pressable-scale';
import { Text } from '@/ui/text';
import { radii, space, tint } from '@/theme/tokens';

import { AiAvatar, type AvatarState } from './ai-avatar';
import { BlockView, ContextNotice, UserBubble, AttachChip } from './blocks';
import { INITIAL_MESSAGE, respondTo, type AssistantTurn, type DocRef } from './scenario';

type ChatMessage =
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'assistant'; turn: AssistantTurn }
  | { id: number; role: 'context'; text: string };

type HistoryItem = { id: string; title: string; snippet: string; time: string };

const DEMO_ATTACHMENTS = ['Счёт №1024.pdf', 'Акт сверки.pdf', 'Реестр начислений.xlsx', 'Договор поставки.docx'];
const STEP = 1150;

export const AssistantChat = observer(function AssistantChat() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const selectedId = use$(selectedId$);
  const institution = use$(selected$);

  const idRef = useRef(1);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, role: 'assistant', turn: INITIAL_MESSAGE }]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [pending, setPending] = useState<AssistantTurn | null>(null);
  const [stageIdx, setStageIdx] = useState(0);
  const [viewerDoc, setViewerDoc] = useState<DocViewerTarget | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyQuery, setHistoryQuery] = useState('');

  const listRef = useRef<LegendListRef>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [messages, pending, stageIdx]);

  const contextLabel =
    selectedId === 'all' ? `Все учреждения (${institutions.length})` : institution?.shortName ?? 'Учреждение';

  // Смена учреждения → ассистент сообщает о новом контексте.
  const prevSelectedId = useRef(selectedId);
  useEffect(() => {
    if (prevSelectedId.current === selectedId) return;
    prevSelectedId.current = selectedId;
    const text =
      selectedId === 'all'
        ? `Контекст: все учреждения (${institutions.length}). Работаю по сводным данным — уточните учреждение, если нужно сфокусироваться.`
        : `Контекст обновлён: ${institution?.name ?? institution?.shortName ?? 'учреждение'}. Проверки, поиск и сверки выполняю в периметре этого учреждения.`;
    setMessages((prev) => [...prev, { id: ++idRef.current, role: 'context', text }]);
  }, [selectedId, institution]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;
      const turn = respondTo(text);
      const uid = ++idRef.current;
      setMessages((prev) => [...prev, { id: uid, role: 'user', text }]);
      setInput('');
      setPending(turn);
      setStageIdx(0);
      clearTimers();

      const stages = turn.stages ?? [];
      const pushAnswer = () => {
        setMessages((prev) => [...prev, { id: ++idRef.current, role: 'assistant', turn }]);
        setPending(null);
      };
      if (stages.length) {
        stages.forEach((_, i) => timersRef.current.push(setTimeout(() => setStageIdx(i), i * STEP)));
        timersRef.current.push(setTimeout(pushAnswer, stages.length * STEP + 360));
      } else {
        timersRef.current.push(setTimeout(pushAnswer, STEP));
      }
    },
    [pending, clearTimers],
  );

  const handleSend = useCallback(() => {
    const text = input.trim() || (attachments.length ? 'проверь приложенные документы' : '');
    if (!text || pending) return;
    setAttachments([]);
    send(text);
  }, [input, attachments.length, pending, send]);

  const resetChat = useCallback(() => {
    clearTimers();
    setPending(null);
    setStageIdx(0);
    setAttachments([]);
    idRef.current = 1;
    setMessages([{ id: 1, role: 'assistant', turn: INITIAL_MESSAGE }]);
  }, [clearTimers]);

  const openDoc = useCallback(
    (ref: DocRef) => setViewerDoc({ name: ref.name, ext: ref.ext, page: ref.page, hint: ref.hint }),
    [],
  );

  const pickFile = useCallback(() => {
    setAttachments((prev) => (prev.length >= DEMO_ATTACHMENTS.length ? prev : [...prev, DEMO_ATTACHMENTS[prev.length]]));
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, j) => j !== index));
  }, []);

  const renderItem = useCallback(
    ({ item }: LegendListRenderItemProps<ChatMessage>) => {
      if (item.role === 'user') {
        return (
          <View style={styles.msgWrap}>
            <UserBubble text={item.text} />
          </View>
        );
      }
      if (item.role === 'context') {
        return (
          <View style={styles.msgWrap}>
            <ContextNotice text={item.text} />
          </View>
        );
      }
      return (
        <View style={styles.msgWrap}>
          <AssistantBubble turn={item.turn} onSuggestion={send} onOpenDoc={openDoc} />
        </View>
      );
    },
    [send, openDoc],
  );

  const demoHistory = useMemo<HistoryItem[]>(
    () => [
      { id: 'h1', title: 'Проверка документов за май', snippet: '3 документа требуют внимания: КПП, подпись, КОСГУ.', time: 'Сегодня, 10:24' },
      { id: 'h2', title: 'Поиск счёта от «КанцТорг»', snippet: 'Найдены счёт и акт сверки, открыты по ссылке.', time: 'Вчера, 16:08' },
      { id: 'h3', title: 'Письмо в Роспотребнадзор', snippet: 'Подготовлен и отправлен ответ вх-0410.', time: 'Вчера, 12:41' },
      { id: 'h4', title: 'Сверка КОСГУ по бахилам', snippet: 'Применён код 346, обновлено 12 строк реестра.', time: '16 июня, 09:30' },
      { id: 'h5', title: 'Пояснительная по ГСМ', snippet: 'Превышение лимита +9,3%, записка сформирована.', time: '15 июня, 14:12' },
    ],
    [],
  );
  const filteredHistory = useMemo(() => {
    const q = historyQuery.trim().toLowerCase();
    return demoHistory.filter((h) => !q || `${h.title} ${h.snippet}`.toLowerCase().includes(q));
  }, [demoHistory, historyQuery]);

  const canSend = (input.trim().length > 0 || attachments.length > 0) && !pending;

  return (
    <View style={[styles.root, { backgroundColor: theme.bgLayout }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + space.sm, backgroundColor: theme.bgContainer, borderBottomColor: theme.borderSecondary },
        ]}>
        <View style={styles.headerRow}>
          <PressableScale
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Назад"
            style={[styles.iconBtn, { backgroundColor: theme.fillSecondary }]}>
            <Icon icon={ArrowLeft01Icon} size={20} />
          </PressableScale>
          <View style={styles.flex1}>
            <Text variant="bodyStrong" numberOfLines={1}>
              Ассистент
            </Text>
            <Text variant="footnote" themeColor="textSecondary" numberOfLines={1}>
              AI-помощник бухгалтера
            </Text>
          </View>
          <PressableScale
            onPress={() => setHistoryOpen(true)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="История диалогов"
            style={[styles.iconBtn, { backgroundColor: theme.fillSecondary }]}>
            <Icon icon={Clock01Icon} size={19} />
          </PressableScale>
          <PressableScale
            onPress={resetChat}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Новый диалог"
            style={[styles.iconBtn, { backgroundColor: theme.fillSecondary }]}>
            <Icon icon={RefreshIcon} size={19} />
          </PressableScale>
        </View>
        <View style={styles.contextBar}>
          <View style={[styles.contextTag, { backgroundColor: tint(theme.primary, 0.1) }]}>
            <Icon icon={Building03Icon} size={13} themeColor="primary" />
            <Text variant="caption" themeColor="primary" style={styles.semibold} numberOfLines={1}>
              {contextLabel}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex1} behavior={KeyboardBehavior} keyboardVerticalOffset={0}>
        <LegendList
          ref={listRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          recycleItems={false}
          maintainVisibleContentPosition
          alignItemsAtEnd
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.flex1}
          ListFooterComponent={
            pending ? (
              <Thinking stages={pending.stages} stageIdx={stageIdx} state={pending.mood === 'search' ? 'search' : 'thinking'} />
            ) : null
          }
        />

        <View
          style={[
            styles.inputWrap,
            { paddingBottom: insets.bottom + 10, backgroundColor: theme.bgContainer, borderTopColor: theme.borderSecondary },
          ]}>
          <View style={[styles.inputBox, { borderColor: theme.border, backgroundColor: theme.bgElevated }]}>
            {attachments.length > 0 ? (
              <View style={styles.attachRow}>
                {attachments.map((name, i) => (
                  <AttachChip key={`${name}-${i}`} name={name} onRemove={() => removeAttachment(i)} />
                ))}
              </View>
            ) : null}
            <View style={styles.inputRow}>
              <PressableScale
                onPress={pickFile}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel="Прикрепить документ"
                style={styles.circleGhost}>
                <Icon icon={Attachment01Icon} size={18} themeColor="textTertiary" />
              </PressableScale>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Опишите задачу: «проверь документы за май», «найди счёт от КанцТорг»…"
                placeholderTextColor={theme.textTertiary}
                multiline
                style={[styles.textInput, { color: theme.text }]}
              />
              <PressableScale
                onPress={handleSend}
                disabled={!canSend}
                accessibilityRole="button"
                accessibilityLabel="Отправить"
                style={[styles.sendBtn, { backgroundColor: canSend ? theme.primary : theme.fill }]}>
                <Icon icon={SentIcon} size={18} color={canSend ? theme.onPrimary : theme.textTertiary} />
              </PressableScale>
            </View>
          </View>
          <View style={styles.disclaimer}>
            <Icon icon={InformationCircleIcon} size={13} themeColor="textTertiary" />
            <Text variant="caption" themeColor="textTertiary">
              ИИ может ошибаться — перепроверяйте важную информацию.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <AppBottomSheet visible={historyOpen} onClose={() => setHistoryOpen(false)} title="История диалогов" snapPoints={['78%']}>
        <View style={[styles.searchBox, { borderColor: theme.border, backgroundColor: theme.bgElevated }]}>
          <Icon icon={Search01Icon} size={16} themeColor="textTertiary" />
          <TextInput
            value={historyQuery}
            onChangeText={setHistoryQuery}
            placeholder="Поиск по истории…"
            placeholderTextColor={theme.textTertiary}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
        {filteredHistory.length === 0 ? (
          <Text variant="footnote" themeColor="textTertiary" style={styles.emptyHistory}>
            Ничего не найдено
          </Text>
        ) : (
          <View style={styles.historyList}>
            {filteredHistory.map((h) => (
              <PressableScale
                key={h.id}
                onPress={() => setHistoryOpen(false)}
                style={[styles.historyCard, { borderColor: theme.borderSecondary, backgroundColor: theme.bgContainer }]}>
                <View style={styles.historyHead}>
                  <Text variant="bodyStrong" numberOfLines={1} style={styles.flex1}>
                    {h.title}
                  </Text>
                  <Text variant="caption" themeColor="textTertiary">
                    {h.time}
                  </Text>
                </View>
                <Text variant="footnote" themeColor="textSecondary" numberOfLines={2} style={styles.historySnippet}>
                  {h.snippet}
                </Text>
              </PressableScale>
            ))}
          </View>
        )}
      </AppBottomSheet>

      <DocumentViewer target={viewerDoc} onClose={() => setViewerDoc(null)} />
    </View>
  );
});

const keyExtractor = (m: ChatMessage) => String(m.id);

const AssistantBubble = memo(function AssistantBubble({
  turn,
  onSuggestion,
  onOpenDoc,
}: {
  turn: AssistantTurn;
  onSuggestion: (q: string) => void;
  onOpenDoc: (ref: DocRef) => void;
}) {
  return (
    <View style={styles.assistantRow}>
      <AiAvatar state="idle" />
      <View style={styles.assistantCol}>
        {turn.blocks.map((b, i) => (
          <Animated.View key={i} entering={FadeInDown.duration(320).delay(Math.min(i * 70, 420))}>
            <BlockView block={b} onSuggestion={onSuggestion} onOpenDoc={onOpenDoc} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
});

const Thinking = memo(function Thinking({
  stages,
  stageIdx,
  state,
}: {
  stages?: string[];
  stageIdx: number;
  state: AvatarState;
}) {
  const theme = useTheme();
  const label = stages && stages.length ? stages[Math.min(stageIdx, stages.length - 1)] : null;
  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.thinkingRow}>
      <AiAvatar state={state} />
      <View style={[styles.thinkingBubble, { backgroundColor: theme.bgElevated, borderColor: theme.borderSecondary }]}>
        <TypingDots />
        {label ? (
          <Text variant="footnote" themeColor="textSecondary">
            {label}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
});

function TypingDots() {
  return (
    <View style={styles.dotsRow}>
      <Dot delay={0} />
      <Dot delay={130} />
      <Dot delay={260} />
    </View>
  );
}

const Dot = memo(function Dot({ delay }: { delay: number }) {
  const theme = useTheme();
  const v = useSharedValue(0.35);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 380, easing: Easing.out(Easing.quad) }),
          withTiming(0.35, { duration: 380, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [v, delay]);
  const style = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ scale: 0.7 + v.value * 0.3 }] }));
  return <Animated.View style={[styles.dotTyping, { backgroundColor: theme.textTertiary }, style]} />;
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex1: { flex: 1, minWidth: 0 },
  semibold: { fontWeight: '600' },

  header: { paddingHorizontal: space.lg, paddingBottom: space.sm, borderBottomWidth: StyleSheet.hairlineWidth, gap: space.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  iconBtn: { width: 38, height: 38, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  contextBar: { flexDirection: 'row' },
  contextTag: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radii.pill, paddingHorizontal: 11, paddingVertical: 4, maxWidth: '100%' },

  listContent: { paddingHorizontal: space.lg, paddingVertical: space.lg },
  msgWrap: { marginBottom: 18 },

  assistantRow: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  assistantCol: { flex: 1, minWidth: 0, gap: 10 },

  thinkingRow: { flexDirection: 'row', gap: space.md, alignItems: 'center', marginBottom: 18 },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 4,
    borderTopRightRadius: radii.xl,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dotsRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dotTyping: { width: 6, height: 6, borderRadius: radii.pill },

  inputWrap: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: space.lg, paddingTop: 10, gap: space.sm },
  inputBox: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radii.xl, padding: 6, gap: 4 },
  attachRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 6, paddingTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm },
  circleGhost: { width: 34, height: 34, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  textInput: { flex: 1, fontSize: 15, lineHeight: 20, paddingTop: 8, paddingBottom: 8, maxHeight: 120 },
  sendBtn: { width: 38, height: 38, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  disclaimer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },

  searchBox: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderWidth: StyleSheet.hairlineWidth, borderRadius: radii.md, paddingHorizontal: space.md, marginBottom: space.md },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 10 },
  emptyHistory: { textAlign: 'center', paddingVertical: space.xxl },
  historyList: { gap: space.sm },
  historyCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radii.lg, paddingVertical: 10, paddingHorizontal: space.md },
  historyHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  historySnippet: { marginTop: 3, lineHeight: 18 },
});
