import { StyleSheet, ScrollView, View, Text, Pressable, Alert, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as LocalAuthentication from 'expo-local-authentication';
import { wipeVault, changePIN, isSetup, getSettings, setBiometricEnabled as vaultSetBiometric, isUnlocked } from '@/lib/vault-store';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const [vaultSetup, setVaultSetup] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

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
