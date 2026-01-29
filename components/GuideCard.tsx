import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import type { Guide } from '@/lib/types';

interface GuideCardProps {
  guide: Guide;
  onPress: () => void;
}

export default function GuideCard({ guide, onPress }: GuideCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={guide.icon as any} size={32} color="#6C63FF" />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {guide.title}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{guide.category}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {guide.description}
        </Text>
      </View>

      <FontAwesome name="chevron-right" size={16} color="#8888AA" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141420',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.7,
    backgroundColor: '#1A1A28',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#6C63FF20',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6C63FF',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#8888AA',
  },
});
