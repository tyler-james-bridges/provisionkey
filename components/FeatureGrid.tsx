import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const FEATURES = [
  {
    icon: 'shield' as const,
    title: 'Offline Security',
    description:
      'Your vault data never leaves your device. Everything encrypted locally with military-grade encryption.',
  },
  {
    icon: 'heart' as const,
    title: 'Made for Everyone',
    description:
      "Clear, jargon-free guides designed for people who aren't crypto experts — perfect for your loved ones.",
  },
  {
    icon: 'book' as const,
    title: 'Complete Coverage',
    description:
      'Hardware wallets, software wallets, seed phrases, recovery scenarios — all the knowledge in one place.',
  },
  {
    icon: 'exclamation-triangle' as const,
    title: 'Emergency Ready',
    description:
      'Quick-access guides for urgent situations when time is critical and stress is high.',
  },
  {
    icon: 'refresh' as const,
    title: 'Always Current',
    description:
      'Guides updated to reflect the latest wallet software, security practices, and recovery techniques.',
  },
  {
    icon: 'lock' as const,
    title: 'Privacy First',
    description:
      'No accounts, no tracking, no data collection. Your security information stays yours, always.',
  },
];

export default function FeatureGrid() {
  return (
    <View style={styles.grid}>
      {FEATURES.map((feature, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.iconContainer}>
            <FontAwesome name={feature.icon} size={24} color="#6C63FF" />
          </View>
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.description}>{feature.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#141420',
    borderWidth: 1,
    borderColor: '#1F1F2E',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '48%',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '46%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(108,99,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8888AA',
    lineHeight: 20,
  },
});
