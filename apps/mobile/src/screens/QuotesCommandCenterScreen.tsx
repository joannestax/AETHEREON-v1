import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { apiDelete, apiGet, apiPost } from '../api/client';
import { colors, radii, spacing, typography } from '../theme/tokens';

export type QuoteCategory =
  | 'Opening'
  | 'Identity'
  | 'Risk'
  | 'Wisdom'
  | 'Signature'
  | 'Action'
  | 'Mindset'
  | 'Closing';

export type Quote = {
  id: number;
  text: string;
  speaker: string;
  category: QuoteCategory;
};

const CATEGORIES: QuoteCategory[] = [
  'Opening',
  'Identity',
  'Risk',
  'Wisdom',
  'Signature',
  'Action',
  'Mindset',
  'Closing',
];

export function QuotesCommandCenterScreen() {
  const navigation = useNavigation();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [draft, setDraft] = useState('');
  const [category, setCategory] = useState<QuoteCategory>('Wisdom');
  const [filter, setFilter] = useState<QuoteCategory | 'All'>('All');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<{ quotes: Quote[] }>('/v1/quotes');
      setQuotes(data.quotes);
      setOffline(false);
    } catch {
      setOffline(true);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addQuote = async () => {
    const text = draft.trim();
    if (!text) return;
    try {
      const created = await apiPost<Quote>('/v1/quotes', { text, category });
      setQuotes((q) => [...q, created]);
      setDraft('');
    } catch {
      setOffline(true);
    }
  };

  const removeQuote = async (id: number) => {
    try {
      await apiDelete(`/v1/quotes/${id}`);
      setQuotes((q) => q.filter((x) => x.id !== id));
    } catch {
      setOffline(true);
    }
  };

  const filtered =
    filter === 'All' ? quotes : quotes.filter((q) => q.category === filter);

  return (
    <CosmicBackground>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← BACK</Text>
        </Pressable>
        <Text style={styles.title}>COMMAND CENTER</Text>
        <Text style={styles.sub}>DAILY QUOTES · AETHERON</Text>
      </View>

      {offline ? (
        <Text style={styles.warn}>
          Backend offline — start FastAPI to add/edit quotes.
        </Text>
      ) : null}

      <GlassCard style={styles.composer}>
        <Text style={styles.label}>NEW TRANSMISSION</Text>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Speak as Aetheron…"
          placeholderTextColor={colors.text.tertiary}
          multiline
        />
        <View style={styles.cats}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.cat, category === c && styles.catActive]}
            >
              <Text style={[styles.catText, category === c && styles.catTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.addBtn} onPress={addQuote}>
          <Text style={styles.addText}>ADD QUOTE</Text>
        </Pressable>
      </GlassCard>

      <View style={styles.filters}>
        <Pressable
          onPress={() => setFilter('All')}
          style={[styles.cat, filter === 'All' && styles.catActive]}
        >
          <Text style={[styles.catText, filter === 'All' && styles.catTextActive]}>All</Text>
        </Pressable>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setFilter(c)}
            style={[styles.cat, filter === c && styles.catActive]}
          >
            <Text style={[styles.catText, filter === c && styles.catTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.gold.primary} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(q) => String(q.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <GlassCard style={styles.quoteCard}>
              <Text style={styles.qCat}>{item.category.toUpperCase()}</Text>
              <Text style={styles.qText}>“{item.text}”</Text>
              <View style={styles.qRow}>
                <Text style={styles.speaker}>{item.speaker}</Text>
                <Pressable onPress={() => removeQuote(item.id)}>
                  <Text style={styles.delete}>REMOVE</Text>
                </Pressable>
              </View>
            </GlassCard>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No quotes in this category yet.</Text>
          }
        />
      )}
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 52,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  back: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.brand,
    color: colors.gold.bright,
    fontSize: 20,
  },
  sub: {
    ...typography.uiMedium,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 4,
  },
  warn: {
    ...typography.uiMedium,
    color: '#FCA5A5',
    textAlign: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    fontSize: 12,
  },
  composer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  label: {
    ...typography.uiBold,
    color: colors.gold.primary,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  input: {
    ...typography.ui,
    color: colors.text.primary,
    minHeight: 64,
    borderWidth: 1,
    borderColor: colors.cyan.border,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  cat: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  catActive: {
    borderColor: colors.gold.muted,
    backgroundColor: colors.gold.ghost,
  },
  catText: {
    ...typography.uiMedium,
    color: colors.text.tertiary,
    fontSize: 10,
  },
  catTextActive: {
    color: colors.gold.bright,
  },
  addBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.gold.primary,
  },
  addText: {
    ...typography.uiBold,
    color: colors.space.void,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  quoteCard: { gap: spacing.sm },
  qCat: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  qText: {
    ...typography.display,
    color: colors.text.primary,
    fontSize: 20,
    lineHeight: 26,
  },
  qRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speaker: {
    ...typography.uiMedium,
    color: colors.gold.soft,
    fontSize: 11,
  },
  delete: {
    ...typography.uiBold,
    color: colors.signal.bearish,
    fontSize: 10,
    letterSpacing: 1,
  },
  empty: {
    ...typography.ui,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
