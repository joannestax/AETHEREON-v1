import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { NATIVE_DRIVER } from '../../utils/animation';
import type { ChatMessage } from '../../types/chat';

type Props = {
  message: ChatMessage;
};

export function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const cursor = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!message.streaming) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursor, { toValue: 0.15, duration: 420, useNativeDriver: NATIVE_DRIVER }),
        Animated.timing(cursor, { toValue: 1, duration: 420, useNativeDriver: NATIVE_DRIVER }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [message.streaming, cursor]);

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAi]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={styles.text}>{message.content}</Text>
        {message.streaming ? (
          <Animated.Text style={[styles.cursor, { opacity: cursor }]}>▍</Animated.Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.md,
    maxWidth: '92%',
  },
  rowUser: {
    alignSelf: 'flex-end',
  },
  rowAi: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderColor: colors.glass.strokeGold,
  },
  aiBubble: {
    backgroundColor: colors.glass.fill,
    borderColor: colors.glass.stroke,
  },
  text: {
    ...typography.ui,
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 21,
  },
  cursor: {
    ...typography.uiBold,
    color: colors.cyan.primary,
    fontSize: 14,
  },
});
