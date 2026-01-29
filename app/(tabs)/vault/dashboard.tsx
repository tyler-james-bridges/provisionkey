import { StyleSheet, ScrollView, View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import VaultEntryCard from '@/components/VaultEntryCard';
import { getVaultData, lock } from '@/lib/vault-store';
import type { VaultEntry } from '@/lib/types';

export default function VaultDashboardScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await getVaultData();
      setEntries(data.entries);
    } catch (error) {
      Alert.alert('Error', 'Failed to load vault entries');
    } finally {
      setLoading(false);
    }
  };

  const handleLock = () => {
    Alert.alert(
      'Lock Vault',
      'Are you sure you want to lock the vault?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Lock',
          style: 'destructive',
          onPress: () => {
            lock();
            router.replace('/vault');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={[styles.loadingText, { marginTop: 16 }]}>Loading vault...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Vault</Text>
        <Pressable onPress={handleLock} style={styles.lockButton}>
          <FontAwesome name="lock" size={20} color="#FF4444" />
        </Pressable>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome name="folder-open" size={64} color="#8888AA" />
          <Text style={styles.emptyTitle}>No Entries Yet</Text>
          <Text style={styles.emptyText}>
            Your vault is empty. Add your first entry to securely store recovery phrases,
            private keys, or other sensitive information.
          </Text>
          <Pressable
            style={styles.addFirstButton}
            onPress={() => router.push('/vault/add')}
          >
            <FontAwesome name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addFirstButtonText}>Add First Entry</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.entriesList}>
          {entries.map((entry) => (
            <VaultEntryCard
              key={entry.id}
              entry={entry}
              onPress={() => router.push(`/vault/${entry.id}`)}
            />
          ))}
        </ScrollView>
      )}

      {entries.length > 0 && (
        <Pressable
          style={styles.fab}
          onPress={() => router.push('/vault/add')}
        >
          <FontAwesome name="plus" size={24} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#141420',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lockButton: {
    padding: 8,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 24,
  },
  addFirstButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  entriesList: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
