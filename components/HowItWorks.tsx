import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const STEPS = [
  {
    icon: 'book' as const,
    title: 'Browse Guides',
    description:
      'Learn about wallet types, seed phrases, hardware devices, and recovery processes with easy-to-follow guides designed for anyone.',
  },
  {
    icon: 'lock' as const,
    title: 'Set Up Your Vault',
    description:
      'Create a secure PIN-protected vault that encrypts your recovery information locally on your device — never in the cloud.',
  },
  {
    icon: 'folder-open' as const,
    title: 'Store Recovery Info',
    description:
      "Securely save seed phrases, private keys, wallet addresses, and other critical information you'll need.",
  },
  {
    icon: 'users' as const,
    title: 'Share Instructions',
    description:
      'Give trusted contacts clear, step-by-step instructions on how to access your vault in an emergency.',
  },
];

export default function HowItWorks() {
  const anims = useRef(STEPS.map(() => new Animated.Value(0))).current;
  const translates = useRef(STEPS.map(() => new Animated.Value(40))).current;

  useEffect(() => {
    const animations = STEPS.map((_, i) =>
      Animated.parallel([
        Animated.timing(anims[i], {
          toValue: 1,
          duration: 600,
          delay: i * 150,
          useNativeDriver: true,
        }),
        Animated.timing(translates[i], {
          toValue: 0,
          duration: 600,
          delay: i * 150,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>How It Works</Text>
      {STEPS.map((step, i) => (
        <React.Fragment key={i}>
          <Animated.View
            style={[
              styles.card,
              { opacity: anims[i], transform: [{ translateY: translates[i] }] },
            ]}
          >
            <View style={styles.iconCircle}>
              <FontAwesome name={step.icon} size={28} color="#6C63FF" />
            </View>
            <Text style={styles.stepLabel}>STEP {i + 1}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </Animated.View>
          {i < STEPS.length - 1 && (
            <View style={styles.arrowContainer}>
              <FontAwesome name="angle-down" size={20} color="#2A2A3A" />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#141420',
    borderWidth: 1,
    borderColor: '#1F1F2E',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(108,99,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 22,
  },
  arrowContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
