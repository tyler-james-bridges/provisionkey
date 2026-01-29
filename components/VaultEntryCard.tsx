import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import type { VaultEntry } from '@/lib/types';

interface VaultEntryCardProps {
  entry: VaultEntry;
  onPress: () => void;
}

const getIconForType = (type: VaultEntry['type']) => {
  const iconMap: Record<VaultEntry['type'], string> = {
    'hardware-wallet': 'usb',
    'software-wallet': 'mobile',
    'exchange': 'exchange',
    'seed-backup': 'key',
    'other': 'file-text',
  };
  return iconMap[type] || 'file-text';
};

const getTypeLabel = (type: VaultEntry['type']) => {
  const labelMap: Record<VaultEntry['type'], string> = {
    'hardware-wallet': 'Hardware Wallet',
    'software-wallet': 'Software Wallet',
    'exchange': 'Exchange',
    'seed-backup': 'Seed Backup',
    'other': 'Other',
  };
  return labelMap[type] || 'Other';
};

const formatDate = (dateString: string | number) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString();
};

export default function VaultEntryCard({ entry, onPress }: VaultEntryCardProps) {
  const fieldCount = entry.fields.length;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={getIconForType(entry.type) as any} size={24} color="#6C63FF" />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.typeLabel}>{getTypeLabel(entry.type)}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.fieldCount}>
            {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
          </Text>
        </View>

        <Text style={styles.updatedAt}>
          Updated {formatDate(entry.updatedAt)}
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
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 13,
    color: '#8888AA',
  },
  separator: {
    fontSize: 13,
    color: '#8888AA',
    marginHorizontal: 6,
  },
  fieldCount: {
    fontSize: 13,
    color: '#8888AA',
  },
  updatedAt: {
    fontSize: 12,
    color: '#666677',
  },
});
