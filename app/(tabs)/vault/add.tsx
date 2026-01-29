import { StyleSheet, ScrollView, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addEntry } from '@/lib/vault-store';
import type { VaultEntryType, VaultField } from '@/lib/types';

const ENTRY_TYPES: { value: VaultEntryType; label: string }[] = [
  { value: 'hardware-wallet', label: 'Hardware Wallet' },
  { value: 'software-wallet', label: 'Software Wallet' },
  { value: 'exchange', label: 'Exchange Account' },
  { value: 'seed-backup', label: 'Seed Backup' },
  { value: 'other', label: 'Other' },
];

export default function AddVaultEntryScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<VaultEntryType>('hardware-wallet');
  const [notes, setNotes] = useState('');
  const [fields, setFields] = useState<VaultField[]>([]);
  const [saving, setSaving] = useState(false);

  const addField = () => {
    setFields([...fields, { label: '', value: '', sensitive: true }]);
  };

  const updateField = (index: number, updates: Partial<VaultField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for this entry');
      return;
    }

    const validFields = fields.filter(f => f.label.trim() && f.value.trim());

    if (validFields.length === 0) {
      Alert.alert('Error', 'Please add at least one field');
      return;
    }

    setSaving(true);
    try {
      const now = Date.now();
      await addEntry({
        id: now.toString(),
        name: name.trim(),
        type,
        notes: notes.trim(),
        fields: validFields,
        createdAt: now,
        updatedAt: now,
      });

      Alert.alert('Success', 'Entry added to vault', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Entry Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Main Wallet Recovery"
            placeholderTextColor="#8888AA"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeContainer}>
            {ENTRY_TYPES.map((t) => (
              <Pressable
                key={t.value}
                style={[styles.typeOption, type === t.value && styles.typeOptionSelected]}
                onPress={() => setType(t.value)}
              >
                <Text style={[styles.typeOptionText, type === t.value && styles.typeOptionTextSelected]}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional information"
            placeholderTextColor="#8888AA"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Fields</Text>
            <Pressable style={styles.addFieldButton} onPress={addField}>
              <FontAwesome name="plus" size={14} color="#6C63FF" />
              <Text style={styles.addFieldButtonText}>Add Field</Text>
            </Pressable>
          </View>

          {fields.map((field, index) => (
            <View key={index} style={styles.fieldCard}>
              <TextInput
                style={styles.fieldInput}
                value={field.label}
                onChangeText={(text) => updateField(index, { label: text })}
                placeholder="Field label (e.g., Seed Phrase)"
                placeholderTextColor="#8888AA"
              />
              <TextInput
                style={[styles.fieldInput, styles.fieldValueInput]}
                value={field.value}
                onChangeText={(text) => updateField(index, { value: text })}
                placeholder="Field value"
                placeholderTextColor="#8888AA"
                secureTextEntry={field.sensitive}
                multiline
              />
              <View style={styles.fieldActions}>
                <Pressable
                  style={styles.toggleButton}
                  onPress={() => updateField(index, { sensitive: !field.sensitive })}
                >
                  <FontAwesome
                    name={field.sensitive ? 'eye-slash' : 'eye'}
                    size={16}
                    color="#8888AA"
                  />
                  <Text style={styles.toggleButtonText}>
                    {field.sensitive ? 'Hidden' : 'Visible'}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeField(index)}
                >
                  <FontAwesome name="trash" size={16} color="#FF4444" />
                </Pressable>
              </View>
            </View>
          ))}

          {fields.length === 0 && (
            <View style={styles.noFieldsPrompt}>
              <Text style={styles.noFieldsText}>
                No fields added yet. Click "Add Field" to add sensitive information.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Entry'}
          </Text>
        </Pressable>
      </View>
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
  section: {
    padding: 20,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#141420',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    backgroundColor: '#141420',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  typeOptionSelected: {
    borderColor: '#6C63FF',
    backgroundColor: '#6C63FF20',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#8888AA',
  },
  typeOptionTextSelected: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  addFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  addFieldButtonText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
  fieldCard: {
    backgroundColor: '#141420',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  fieldInput: {
    backgroundColor: '#0A0A0F',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  fieldValueInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  fieldActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#8888AA',
  },
  removeButton: {
    padding: 6,
  },
  noFieldsPrompt: {
    padding: 20,
    alignItems: 'center',
  },
  noFieldsText: {
    fontSize: 14,
    color: '#8888AA',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#141420',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3A',
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8888AA',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#2A2A3A',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
