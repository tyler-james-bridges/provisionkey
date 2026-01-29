import { StyleSheet, ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SecureField from '@/components/SecureField';
import { getVaultData, deleteEntry } from '@/lib/vault-store';
import type { VaultEntry } from '@/lib/types';

export default function VaultEntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<VaultEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    try {
      const data = await getVaultData();
      const vaultEntry = data.entries.find(e => e.id === id) || null;
      setEntry(vaultEntry);
    } catch (error) {
      Alert.alert('Error', 'Failed to load entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-circle" size={48} color="#FF4444" />
        <Text style={styles.errorText}>Entry not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.entryName}>{entry.name}</Text>
            <Text style={styles.entryType}>{entry.type}</Text>
          </View>
          <View style={styles.metadata}>
            <Text style={styles.metadataText}>
              Created: {new Date(entry.createdAt).toLocaleDateString()}
            </Text>
            {entry.updatedAt && (
              <Text style={styles.metadataText}>
                Updated: {new Date(entry.updatedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>

        {entry.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{entry.notes}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fields</Text>
          {entry.fields.map((field, index) => (
            <SecureField
              key={index}
              label={field.label}
              value={field.value}
              sensitive={field.sensitive}
            />
          ))}
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <FontAwesome name="trash" size={16} color="#FF4444" />
            <Text style={styles.deleteButtonText}>Delete Entry</Text>
          </Pressable>
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
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8888AA',
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
  header: {
    padding: 20,
    backgroundColor: '#141420',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
  },
  headerInfo: {
    marginBottom: 12,
  },
  entryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  entryType: {
    fontSize: 14,
    color: '#6C63FF',
    textTransform: 'capitalize',
  },
  metadata: {
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: '#8888AA',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  notesCard: {
    backgroundColor: '#141420',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  notesText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  dangerZone: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3A',
    marginTop: 20,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#141420',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
  },
});
