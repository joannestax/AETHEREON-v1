import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AetheronOrb } from '../components/avatar/AetheronOrb';
import { AvatarFormSwitcher } from '../components/chat/AvatarFormSwitcher';
import { ChatBubble } from '../components/chat/ChatBubble';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { AETHERON } from '../constants/aetheron';
import { INITIAL_CHAT_MESSAGES, localMentorReply } from '../data/chatSeed';
import { streamChatReply } from '../api/chatClient';
import { colors, spacing, typography } from '../theme/tokens';
import type { AvatarForm, ChatMessage } from '../types/chat';
import type { RootStackParamList } from '../navigation/types';

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [form, setForm] = useState<AvatarForm>('titan');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const requestSignature = useCallback(
    (ticker = 'NVDA') => {
      navigation.navigate('SignatureAnalysis', { ticker });
    },
    [navigation],
  );

  const onSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    const streamId = uid();
    setDraft('');
    setSending(true);
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: streamId,
        role: 'aetheron',
        content: '',
        createdAt: new Date().toISOString(),
        streaming: true,
      },
    ]);

    const fallback = localMentorReply(text);
    try {
      await streamChatReply(text, (chunk, done) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? { ...m, content: chunk, streaming: !done }
              : m,
          ),
        );
      }, fallback);
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId
            ? { ...m, content: fallback, streaming: false }
            : m,
        ),
      );
    } finally {
      setSending(false);
    }
  }, [draft, sending]);

  return (
    <CosmicBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>ORIGO NEXUS</Text>
          <Text style={styles.sub}>AI MENTOR</Text>
        </View>

        <View style={styles.hero}>
          <AetheronOrb size={112} form={form} />
          <Text style={styles.name}>{AETHERON.name}</Text>
          <Text style={styles.tagline}>{AETHERON.tagline}</Text>
          <AvatarFormSwitcher value={form} onChange={setForm} />
        </View>

        <Pressable style={styles.sigCta} onPress={() => requestSignature('NVDA')}>
          <Text style={styles.sigCtaText}>REQUEST SIGNATURE ANALYSIS</Text>
        </Pressable>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ChatBubble message={item} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <ChatInputBar
          value={draft}
          onChangeText={setDraft}
          onSend={onSend}
          sending={sending}
          placeholder="Ask your Realm Guide…"
        />
      </KeyboardAvoidingView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingTop: 52,
    alignItems: 'center',
  },
  brand: {
    ...typography.brand,
    color: colors.gold.primary,
    fontSize: 14,
  },
  sub: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 2,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  name: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 26,
  },
  tagline: {
    ...typography.ui,
    color: colors.cyan.soft,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  sigCta: {
    alignSelf: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gold.muted,
    backgroundColor: colors.gold.ghost,
  },
  sigCtaText: {
    ...typography.uiBold,
    color: colors.gold.bright,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexGrow: 1,
  },
});
