import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface SecureFieldProps {
  label: string;
  value: string;
  sensitive?: boolean;
}

export default function SecureField({ label, value, sensitive = false }: SecureFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!sensitive) return;

    if (revealed) {
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        handleHide();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [revealed, sensitive]);

  const handleReveal = () => {
    setRevealed(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleHide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setRevealed(false);
      fadeAnim.setValue(1);
    });
  };

  const renderValue = () => {
    if (!sensitive) {
      return <Text style={styles.value}>{value}</Text>;
    }

    if (!revealed) {
      return (
        <View style={styles.hiddenValueContainer}>
          <Text style={styles.hiddenValue}>{'•'.repeat(12)}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.revealButton,
              pressed && styles.revealButtonPressed,
            ]}
            onPress={handleReveal}
          >
            <FontAwesome name="eye" size={14} color="#6C63FF" />
            <Text style={styles.revealButtonText}>Tap to reveal</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <Animated.View style={[styles.revealedContainer, { opacity: fadeAnim }]}>
        <Text style={styles.revealedValue} selectable>
          {value}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.hideButton,
            pressed && styles.hideButtonPressed,
          ]}
          onPress={handleHide}
        >
          <FontAwesome name="eye-slash" size={14} color="#8888AA" />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {renderValue()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8888AA',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: '#141420',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    padding: 12,
  },
  hiddenValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141420',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    padding: 12,
  },
  hiddenValue: {
    fontSize: 18,
    color: '#8888AA',
    letterSpacing: 2,
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF20',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  revealButtonPressed: {
    opacity: 0.6,
  },
  revealButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
    marginLeft: 6,
  },
  revealedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6C63FF40',
    padding: 12,
  },
  revealedValue: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginRight: 8,
  },
  hideButton: {
    padding: 4,
  },
  hideButtonPressed: {
    opacity: 0.6,
  },
});
