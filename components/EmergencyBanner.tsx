import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EmergencyBanner() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Glow animation
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, []);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF444440', '#FF444480'],
  });

  const handlePress = () => {
    router.push('/guides/emergency-recovery');
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.glowBackground,
          {
            backgroundColor: glowColor,
          },
        ]}
      />

      <Pressable
        style={({ pressed }) => [
          styles.banner,
          pressed && styles.bannerPressed,
        ]}
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <FontAwesome name="exclamation-triangle" size={28} color="#FF4444" />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Emergency?</Text>
          <Text style={styles.subtitle}>Start Here</Text>
          <Text style={styles.description}>
            Quick access to recovery guides
          </Text>
        </View>

        <FontAwesome name="arrow-right" size={20} color="#FF4444" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  glowBackground: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1A1A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF4444',
    padding: 20,
    overflow: 'hidden',
  },
  bannerPressed: {
    opacity: 0.8,
    backgroundColor: '#331A1A',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF444420',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF4444',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#CCCCDD',
  },
});
