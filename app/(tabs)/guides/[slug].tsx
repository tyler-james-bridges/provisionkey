import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import StepView from '@/components/StepView';
import { guides } from '@/lib/guides-data';

export default function GuideDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const guide = guides.find(g => g.slug === slug);

  if (!guide) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-circle" size={48} color="#FF4444" />
        <Text style={styles.errorText}>Guide not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const progress = ((currentStep + 1) / guide.steps.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>{guide.title}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {guide.steps.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <StepView step={guide.steps[currentStep]} stepNumber={currentStep + 1} />

        <View style={styles.navigation}>
          {currentStep > 0 && (
            <Pressable
              style={styles.navButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
              <Text style={styles.navButtonText}>Previous</Text>
            </Pressable>
          )}

          {currentStep < guide.steps.length - 1 ? (
            <Pressable
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
            </Pressable>
          ) : (
            <Pressable
              style={[styles.navButton, styles.navButtonSuccess]}
              onPress={() => router.back()}
            >
              <FontAwesome name="check" size={16} color="#FFFFFF" />
              <Text style={styles.navButtonText}>Complete</Text>
            </Pressable>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    backgroundColor: '#141420',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 28,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2A2A3A',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
  },
  progressText: {
    fontSize: 12,
    color: '#8888AA',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#141420',
    borderRadius: 8,
    padding: 14,
  },
  navButtonPrimary: {
    backgroundColor: '#6C63FF',
  },
  navButtonSuccess: {
    backgroundColor: '#44BB44',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
