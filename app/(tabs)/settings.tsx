import { StyleSheet, ScrollView, View, Text, Pressable, Alert, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Clipboard from 'expo-clipboard';
import { wipeVault, changePIN, isSetup, getSettings, setBiometricEnabled as vaultSetBiometric, isUnlocked, setMaxFailedAttempts, exportVault, importVault } from '@/lib/vault-store';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const [vaultSetup, setVaultSetup] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [maxAttempts, setMaxAttempts] = useState(10);

  useEffect(() => {
    checkVaultStatus();
    checkBiometric();
  }, []);

  const checkVaultStatus = async () => {
    const setup = await isSetup();
    setVaultSetup(setup);
    if (setup) {
      const settings = await getSettings();
      if (settings) {
        setBiometricEnabled(settings.biometricEnabled);
        setMaxAttempts(settings.maxFailedAttempts);
      }
    }
  };

  const checkBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    if (!isUnlocked()) {
      Alert.alert('Vault Locked', 'Unlock your vault first before changing biometric settings.');
      return;
    }
    try {
      await vaultSetBiometric(enabled);
      setBiometricEnabled(enabled);
    } catch (error) {
      Alert.alert('Error', 'Failed to update biometric setting');
    }
  };

  const handleSelfDestructConfig = () => {
    const options = [5, 10, 15, 20];
    Alert.alert(
      'Self-Destruct Attempts',
      `Vault will wipe after this many failed PIN attempts. Currently set to ${maxAttempts}.`,
      [
        ...options.map((n) => ({
          text: `${n} attempts${n === maxAttempts ? ' (current)' : ''}`,
          onPress: async () => {
            try {
              await setMaxFailedAttempts(n);
              setMaxAttempts(n);
              Alert.alert('Updated', `Vault will self-destruct after ${n} failed attempts.`);
            } catch {
              Alert.alert('Error', 'Failed to update setting');
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ]
    );
  };

  const handleExport = async () => {
    if (!isUnlocked()) {
      Alert.alert('Vault Locked', 'Unlock your vault first to export.');
      return;
    }
    try {
      const backup = await exportVault();
      await Clipboard.setStringAsync(backup);
      Alert.alert('Exported', 'Encrypted backup copied to clipboard. Paste it somewhere safe — this is your encrypted vault backup.');
    } catch (error) {
      Alert.alert('Error', 'Failed to export vault');
    }
  };

  const handleImport = () => {
    if (!isUnlocked()) {
      Alert.alert('Vault Locked', 'Unlock your vault first to import.');
      return;
    }
    Alert.alert(
      'Import Backup',
      'This will replace your current vault data with the backup from your clipboard. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            try {
              const backup = await Clipboard.getStringAsync();
              if (!backup) {
                Alert.alert('Error', 'Clipboard is empty');
                return;
              }
              await importVault(backup, '');
              Alert.alert('Success', 'Vault data restored from backup.');
            } catch (error) {
              Alert.alert('Error', 'Failed to import. Make sure the backup was created with the same PIN.');
            }
          },
        },
      ]
    );
  };

  const handleChangePIN = () => {
    Alert.prompt(
      'Change PIN',
      'Enter your current PIN',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (currentPIN?: string) => {
            if (!currentPIN) return;
            Alert.prompt(
              'Change PIN',
              'Enter your new PIN',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Change',
                  onPress: async (newPIN?: string) => {
                    if (!newPIN || newPIN.length < 4) {
                      Alert.alert('Error', 'PIN must be at least 4 digits');
                      return;
                    }
                    try {
                      await changePIN(currentPIN, newPIN);
                      Alert.alert('Success', 'PIN changed successfully');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to change PIN. Check your current PIN.');
                    }
                  },
                },
              ],
              'secure-text'
            );
          },
        },
      ],
      'secure-text'
    );
  };

  const handleWipeVault = () => {
    Alert.alert(
      'Wipe Vault',
      'This will permanently delete all vault entries and settings. This action cannot be undone. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Wipe Vault',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Type "DELETE" to confirm vault wipe',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await wipeVault();
                      setVaultSetup(false);
                      Alert.alert('Success', 'Vault has been wiped');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to wipe vault');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vault Security</Text>

        {vaultSetup && (
          <>
            <Pressable style={styles.settingItem} onPress={handleChangePIN}>
              <View style={styles.settingInfo}>
                <FontAwesome name="key" size={20} color="#6C63FF" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Change PIN</Text>
                  <Text style={styles.settingDescription}>
                    Update your vault PIN
                  </Text>
                </View>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#8888AA" />
            </Pressable>

            {biometricAvailable && (
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <FontAwesome name="hand-paper-o" size={20} color="#6C63FF" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Biometric Unlock</Text>
                    <Text style={styles.settingDescription}>
                      Use fingerprint or Face ID
                    </Text>
                  </View>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                  trackColor={{ false: '#2A2A3A', true: '#6C63FF' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            )}
            <Pressable style={styles.settingItem} onPress={handleSelfDestructConfig}>
              <View style={styles.settingInfo}>
                <FontAwesome name="bomb" size={20} color="#FF4444" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Self-Destruct</Text>
                  <Text style={styles.settingDescription}>
                    Wipe after {maxAttempts} failed attempts
                  </Text>
                </View>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#8888AA" />
            </Pressable>
          </>
        )}

        {!vaultSetup && (
          <View style={styles.infoCard}>
            <FontAwesome name="info-circle" size={20} color="#8888AA" />
            <Text style={styles.infoText}>
              Vault is not set up. Go to the Vault tab to create your secure vault.
            </Text>
          </View>
        )}
      </View>

      {vaultSetup && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup</Text>

          <Pressable style={styles.settingItem} onPress={handleExport}>
            <View style={styles.settingInfo}>
              <FontAwesome name="upload" size={20} color="#6C63FF" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Export Vault</Text>
                <Text style={styles.settingDescription}>
                  Copy encrypted backup to clipboard
                </Text>
              </View>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#8888AA" />
          </Pressable>

          <Pressable style={styles.settingItem} onPress={handleImport}>
            <View style={styles.settingInfo}>
              <FontAwesome name="download" size={20} color="#6C63FF" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Import Backup</Text>
                <Text style={styles.settingDescription}>
                  Restore vault from clipboard backup
                </Text>
              </View>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#8888AA" />
          </Pressable>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <FontAwesome name="info-circle" size={20} color="#6C63FF" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>App Version</Text>
              <Text style={styles.settingDescription}>
                {Constants.expoConfig?.version || '1.0.0'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <FontAwesome name="shield" size={20} color="#6C63FF" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>ProvisionKey</Text>
              <Text style={styles.settingDescription}>
                Your crypto emergency guide
              </Text>
            </View>
          </View>
        </View>
      </View>

      {vaultSetup && (
        <View style={styles.section}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>

          <Pressable style={styles.dangerButton} onPress={handleWipeVault}>
            <FontAwesome name="exclamation-triangle" size={20} color="#FF4444" />
            <View style={styles.settingText}>
              <Text style={styles.dangerButtonTitle}>Wipe Vault</Text>
              <Text style={styles.dangerButtonDescription}>
                Permanently delete all vault data
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All vault data is encrypted and stored locally on your device.
        </Text>
        <Text style={styles.footerText}>
          ProvisionKey never sends your data to any server.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141420',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#8888AA',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#141420',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#8888AA',
    lineHeight: 20,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF4444',
    marginBottom: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#141420',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  dangerButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
    marginBottom: 2,
  },
  dangerButtonDescription: {
    fontSize: 12,
    color: '#8888AA',
  },
  footer: {
    padding: 20,
    paddingTop: 40,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 18,
  },
});
