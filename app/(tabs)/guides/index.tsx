import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import GuideCard from '@/components/GuideCard';
import { guides } from '@/lib/guides-data';

const categories = [
  { id: 'basics', title: 'Basics', icon: 'graduation-cap' },
  { id: 'hardware', title: 'Hardware Wallets', icon: 'microchip' },
  { id: 'software', title: 'Software Wallets', icon: 'mobile' },
  { id: 'recovery', title: 'Recovery', icon: 'life-ring' },
];

export default function GuidesListScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Guides</Text>
        <Text style={styles.headerSubtitle}>
          Step-by-step instructions for securing and recovering your crypto
        </Text>
      </View>

      {categories.map((category) => {
        const categoryGuides = guides.filter(g => g.category === category.id);
        if (categoryGuides.length === 0) return null;

        return (
          <View key={category.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            {categoryGuides.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                onPress={() => router.push(`/guides/${guide.slug}`)}
              />
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8888AA',
    lineHeight: 20,
  },
  section: {
    padding: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
});
