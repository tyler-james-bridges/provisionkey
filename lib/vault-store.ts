import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VaultData, VaultEntry, AppSettings } from './types';
import { encrypt, decrypt, generateSalt, hashPin, deriveKey, exportKey, importKey } from './crypto';

const VAULT_KEY = 'provisionkey_vault';
const SETTINGS_KEY = 'provisionkey_settings';
const BIOMETRIC_KEY = 'provisionkey_biometric_key';

let derivedEncryptionKey: CryptoKey | null = null;

export function isUnlocked(): boolean {
  return derivedEncryptionKey !== null;
}

export function lock(): void {
  derivedEncryptionKey = null;
}

export async function getSettings(): Promise<AppSettings | null> {
  const raw = await SecureStore.getItemAsync(SETTINGS_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
}

export async function setupPin(pin: string): Promise<void> {
  const salt = await generateSalt();
  const pinHash = await hashPin(pin, salt);
  const settings: AppSettings = {
    failedAttempts: 0,
    maxFailedAttempts: 10,
    biometricEnabled: false,
    pinHash,
    salt,
  };
  await saveSettings(settings);
  derivedEncryptionKey = await deriveKey(pin, salt);
}

export async function unlockWithPin(pin: string): Promise<boolean> {
  const settings = await getSettings();
  if (!settings) return false;

  const pinHash = await hashPin(pin, settings.salt);
  if (pinHash !== settings.pinHash) {
    settings.failedAttempts++;
    await saveSettings(settings);

    if (settings.failedAttempts >= settings.maxFailedAttempts) {
      await wipeVault();
    }
    return false;
  }

  settings.failedAttempts = 0;
  await saveSettings(settings);
  derivedEncryptionKey = await deriveKey(pin, settings.salt);

  // If biometric is enabled, store exported key for biometric unlock
  if (settings.biometricEnabled) {
    await storeBiometricKey();
  }

  return true;
}

/**
 * Store the current encryption key in SecureStore for biometric access.
 * Call after successful PIN unlock when biometric is enabled.
 */
async function storeBiometricKey(): Promise<void> {
  if (!derivedEncryptionKey) return;
  const exported = await exportKey(derivedEncryptionKey);
  await SecureStore.setItemAsync(BIOMETRIC_KEY, exported, {
    requireAuthentication: true,
  });
}

/**
 * Unlock vault via biometric authentication.
 * Retrieves the encryption key stored after last PIN unlock.
 * Returns false if no biometric key is stored.
 */
export async function unlockWithBiometric(): Promise<boolean> {
  try {
    const keyData = await SecureStore.getItemAsync(BIOMETRIC_KEY, {
      requireAuthentication: true,
    });
    if (!keyData) return false;
    derivedEncryptionKey = await importKey(keyData);

    // Reset failed attempts on successful unlock
    const settings = await getSettings();
    if (settings) {
      settings.failedAttempts = 0;
      await saveSettings(settings);
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Enable or disable biometric unlock.
 * When enabling, stores the current key for biometric access.
 */
export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  const settings = await getSettings();
  if (!settings) throw new Error('Vault not set up');

  settings.biometricEnabled = enabled;
  await saveSettings(settings);

  if (enabled && derivedEncryptionKey) {
    await storeBiometricKey();
  } else if (!enabled) {
    await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
  }
}

export async function getVaultData(): Promise<VaultData> {
  if (!derivedEncryptionKey) throw new Error('Vault is locked');

  // Use AsyncStorage for vault data (no 2KB limit)
  const raw = await AsyncStorage.getItem(VAULT_KEY);
  if (!raw) return { entries: [], version: 1 };

  const decrypted = await decrypt(raw, derivedEncryptionKey);
  return JSON.parse(decrypted);
}

export async function saveVaultData(data: VaultData): Promise<void> {
  if (!derivedEncryptionKey) throw new Error('Vault is locked');

  const encrypted = await encrypt(JSON.stringify(data), derivedEncryptionKey);
  // Use AsyncStorage for vault data (no 2KB limit)
  await AsyncStorage.setItem(VAULT_KEY, encrypted);
}

export async function addEntry(entry: VaultEntry): Promise<void> {
  const data = await getVaultData();
  data.entries.push(entry);
  await saveVaultData(data);
}

export async function updateEntry(entry: VaultEntry): Promise<void> {
  const data = await getVaultData();
  const index = data.entries.findIndex((e) => e.id === entry.id);
  if (index === -1) throw new Error('Entry not found');
  data.entries[index] = entry;
  await saveVaultData(data);
}

export async function deleteEntry(id: string): Promise<void> {
  const data = await getVaultData();
  data.entries = data.entries.filter((e) => e.id !== id);
  await saveVaultData(data);
}

export async function changePIN(
  currentPin: string,
  newPin: string
): Promise<void> {
  const settings = await getSettings();
  if (!settings) throw new Error('Vault not set up');

  const currentHash = await hashPin(currentPin, settings.salt);
  if (currentHash !== settings.pinHash) throw new Error('Invalid current PIN');

  // Decrypt with old key first
  const data = await getVaultData();

  // Derive new key
  const newSalt = await generateSalt();
  const newPinHash = await hashPin(newPin, newSalt);
  derivedEncryptionKey = await deriveKey(newPin, newSalt);

  settings.pinHash = newPinHash;
  settings.salt = newSalt;
  await saveSettings(settings);

  // Re-encrypt with new key
  await saveVaultData(data);

  // Update biometric key if enabled
  if (settings.biometricEnabled) {
    await storeBiometricKey();
  }
}

export async function wipeVault(): Promise<void> {
  await AsyncStorage.removeItem(VAULT_KEY);
  await SecureStore.deleteItemAsync(SETTINGS_KEY);
  await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
  derivedEncryptionKey = null;
}

export async function isSetup(): Promise<boolean> {
  const settings = await getSettings();
  return settings !== null;
}
