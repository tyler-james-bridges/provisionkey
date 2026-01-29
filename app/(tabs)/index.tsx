import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HowItWorks from '@/components/HowItWorks';
import FeatureGrid from '@/components/FeatureGrid';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function useFadeIn(count: number, baseDelay = 0, stagger = 200) {
  const opacities = useRef(Array.from({ length: count }, () => new Animated.Value(0))).current;
  const translates = useRef(Array.from({ length: count }, () => new Animated.Value(30))).current;

  useEffect(() => {
    const animations = opacities.map((_, i) =>
      Animated.parallel([
        Animated.timing(opacities[i], {
          toValue: 1,
          duration: 500,
          delay: baseDelay + i * stagger,
          useNativeDriver: true,
        }),
        Animated.timing(translates[i], {
          toValue: 0,
          duration: 500,
          delay: baseDelay + i * stagger,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.parallel(animations).start();
  }, []);

  return opacities.map((o, i) => ({
    opacity: o,
    transform: [{ translateY: translates[i] }],
  }));
}

export default function HomeScreen() {
  const router = useRouter();

  // Hero pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Hero staggered fade-ins (6 elements)
  const heroAnims = useFadeIn(6, 100, 200);

  // Final CTA fade-ins (3 elements)
  const ctaAnims = useFadeIn(3, 0, 200);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* A. Hero Section */}
        <View style={[styles.hero, { minHeight: SCREEN_HEIGHT * 0.8 }]}>
          <Animated.View style={[styles.heroIconWrap, heroAnims[0], { transform: [{ scale: pulseAnim }] }]}>
            <FontAwesome name="shield" size={80} color="#6C63FF" />
          </Animated.View>

          <Animated.Text style={[styles.heroAppName, heroAnims[1]]}>
            ProvisionKey
          </Animated.Text>

          <Animated.Text style={[styles.heroHeadline, heroAnims[2]]}>
            Secure Your Crypto Legacy
          </Animated.Text>

          <Animated.Text style={[styles.heroSubtitle, heroAnims[3]]}>
            Help your loved ones access your crypto in emergencies — without compromising security now.
          </Animated.Text>

          <Animated.View style={heroAnims[4]}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push('/guides')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
            </Pressable>
          </Animated.View>

          <Animated.View style={heroAnims[5]}>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push('/vault')}
            >
              <Text style={styles.secondaryButtonText}>Set Up Vault</Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* B. Emergency Section */}
        <View style={styles.sectionPadding}>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <FontAwesome name="exclamation-triangle" size={28} color="#FF6666" />
              <Text style={styles.emergencyLabel}>EMERGENCY ACCESS</Text>
            </View>
            <Text style={styles.emergencyDescription}>
              In an emergency? Skip the learning and get immediate help recovering your crypto assets.
            </Text>
            <Pressable
              style={styles.emergencyButton}
              onPress={() => router.push('/guides/emergency-recovery')}
            >
              <Text style={styles.emergencyButtonText}>View Emergency Guide →</Text>
            </Pressable>
          </View>
        </View>

        {/* C. How It Works */}
        <HowItWorks />

        {/* D. Feature Grid */}
        <View style={styles.featureSection}>
          <Text style={styles.featureSectionTitle}>Why ProvisionKey</Text>
          <FeatureGrid />
        </View>

        {/* E. Final CTA */}
        <View style={styles.finalCta}>
          <Animated.Text style={[styles.finalCtaTitle, ctaAnims[0]]}>
            Ready to Protect Your Crypto?
          </Animated.Text>
          <Animated.Text style={[styles.finalCtaSubtitle, ctaAnims[1]]}>
            Take the first step toward giving your loved ones access when it matters most.
          </Animated.Text>
          <Animated.View style={[styles.finalCtaButtons, ctaAnims[2]]}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push('/guides')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push('/vault')}
            >
              <Text style={styles.secondaryButtonText}>Set Up Vault</Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },

  // Hero
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  heroIconWrap: {
    marginBottom: 20,
  },
  heroAppName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  heroHeadline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  primaryButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    height: 56,
    width: 280,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#1F1F2E',
    borderRadius: 12,
    height: 56,
    width: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // Emergency
  sectionPadding: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emergencyCard: {
    backgroundColor: '#2A1515',
    borderWidth: 2,
    borderColor: 'rgba(255,68,68,0.3)',
    borderRadius: 16,
    padding: 24,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  emergencyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6666',
    letterSpacing: 1,
  },
  emergencyDescription: {
    fontSize: 15,
    color: '#8888AA',
    lineHeight: 22,
    marginBottom: 20,
  },
  emergencyButton: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Feature section
  featureSection: {
    paddingVertical: 32,
  },
  featureSectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },

  // Final CTA
  finalCta: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  finalCtaTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  finalCtaSubtitle: {
    fontSize: 16,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  finalCtaButtons: {
    alignItems: 'center',
  },
});
