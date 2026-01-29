import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EmergencyBanner from '@/components/EmergencyBanner';
import GuideCard from '@/components/GuideCard';
import { guides } from '@/lib/guides-data';

export default function HomeScreen() {
  const router = useRouter();

  // Get most important guides (first guide from each category)
  const quickGuides = [
    guides.find(g => g.category === 'basics'),
    guides.find(g => g.category === 'hardware'),
    guides.find(g => g.category === 'software'),
    guides.find(g => g.category === 'recovery'),
  ].filter(Boolean);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <FontAwesome name="shield" size={32} color="#6C63FF" />
          <Text style={styles.title}>ProvisionKey</Text>
        </View>
        <Text style={styles.subtitle}>Your crypto emergency guide</Text>
      </View>

      <EmergencyBanner />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Start Guides</Text>
        <Text style={styles.sectionDescription}>
          Essential guides to secure your crypto assets
        </Text>
        {quickGuides.map((guide) => guide && (
          <GuideCard
            key={guide.slug}
            guide={guide}
            onPress={() => router.push(`/guides/${guide.slug}`)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get Started</Text>
        <View style={styles.getStartedCard}>
          <Text style={styles.getStartedTitle}>
            <FontAwesome name="info-circle" size={18} color="#6C63FF" /> What is ProvisionKey?
          </Text>
          <Text style={styles.getStartedText}>
            ProvisionKey is your comprehensive guide for cryptocurrency emergencies.
            Whether you need to recover a wallet, secure your hardware device, or
            plan for the unexpected, we provide step-by-step instructions.
          </Text>
          <Text style={styles.getStartedText}>
            Our secure vault lets you store critical recovery information encrypted
            on your device, accessible only to you.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/guides')}
          >
            <Text style={styles.primaryButtonText}>Browse All Guides</Text>
            <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <FontAwesome name="book" size={24} color="#6C63FF" />
          <Text style={styles.featureTitle}>Step-by-Step Guides</Text>
          <Text style={styles.featureText}>
            Clear instructions for common crypto scenarios
          </Text>
        </View>
        <View style={styles.featureItem}>
          <FontAwesome name="lock" size={24} color="#6C63FF" />
          <Text style={styles.featureTitle}>Secure Vault</Text>
          <Text style={styles.featureText}>
            Encrypted storage for recovery phrases and keys
          </Text>
        </View>
        <View style={styles.featureItem}>
          <FontAwesome name="exclamation-triangle" size={24} color="#6C63FF" />
          <Text style={styles.featureTitle}>Emergency Ready</Text>
          <Text style={styles.featureText}>
            Quick access when you need it most
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    padding: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#8888AA',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8888AA',
    marginBottom: 16,
  },
  getStartedCard: {
    backgroundColor: '#141420',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  getStartedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  getStartedText: {
    fontSize: 14,
    color: '#8888AA',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  featureItem: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#141420',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#8888AA',
    textAlign: 'center',
  },
});
