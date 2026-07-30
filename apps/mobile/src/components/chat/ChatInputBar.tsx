import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  sending?: boolean;
  placeholder?: string;
};

export function ChatInputBar({
  value,
  onChangeText,
  onSend,
  sending,
  placeholder = 'Message Aetheron…',
}: Props) {
  const canSend = value.trim().length > 0 && !sending;

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          editable={!sending}
          multiline
          maxLength={2000}
          onSubmitEditing={canSend ? onSend : undefined}
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          style={[styles.send, !canSend && styles.sendDisabled]}
        >
          {sending ? (
            <ActivityIndicator color={colors.space.void} size="small" />
          ) : (
            <Text style={styles.sendText}>↑</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cyan.border,
    backgroundColor: colors.glass.fillStrong,
    paddingLeft: spacing.lg,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    ...typography.ui,
    color: colors.text.primary,
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 8,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.35,
  },
  sendText: {
    ...typography.uiBold,
    color: colors.space.void,
    fontSize: 18,
  },
});
