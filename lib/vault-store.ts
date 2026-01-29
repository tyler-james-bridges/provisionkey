import * as SecureStore from 'expo-secure-store';
import { VaultData, VaultEntry, AppSettings } from './types';
import { encrypt, decrypt, generateSalt, hashPin, deriveKey } from './crypto';

const VAULT_KEY = 'provisionkey_vault';
const SETTINGS_KEY = 'provisionkey_settings';

let derivedEncryptionKey: string | null = null;

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
  return true;
}

export async function getVaultData(): Promise<VaultData> {
  if (!derivedEncryptionKey) throw new Error('Vault is locked');

  const raw = await SecureStore.getItemAsync(VAULT_KEY);
  if (!raw) return { entries: [], version: 1 };

  try {
    const decrypted = await decrypt(raw, derivedEncryptionKey);
    return JSON.parse(decrypted);
  } catch {
    return { entries: [], version: 1 };
  }
}

export async function saveVaultData(data: VaultData): Promise<void> {
  if (!derivedEncryptionKey) throw new Error('Vault is locked');

  const encrypted = await encrypt(JSON.stringify(data), derivedEncryptionKey);
  await SecureStore.setItemAsync(VAULT_KEY, encrypted);
}

export async function addEntry(entry: VaultEntry): Promise<void> {
  const data = await getVaultData();
  data.entries.push(entry);
  await saveVaultData(data);
}

export async function updateEntry(entry: VaultEntry): Promise<void> {
  const data = await getVaultData();
  const index = data.entries.findIndex(e => e.id === entry.id);
  if (index === -1) throw new Error('Entry not found');
  data.entries[index] = entry;
  await saveVaultData(data);
}

export async function deleteEntry(id: string): Promise<void> {
  const data = await getVaultData();
  data.entries = data.entries.filter(e => e.id !== id);
  await saveVaultData(data);
}

export async function changePIN(currentPin: string, newPin: string): Promise<void> {
  const settings = await getSettings();
  if (!settings) throw new Error('Vault not set up');

  const currentHash = await hashPin(currentPin, settings.salt);
  if (currentHash !== settings.pinHash) throw new Error('Invalid current PIN');

  const newSalt = await generateSalt();
  const newPinHash = await hashPin(newPin, newSalt);

  // Re-encrypt vault data with new key
  const data = await getVaultData();
  derivedEncryptionKey = await deriveKey(newPin, newSalt);

  settings.pinHash = newPinHash;
  settings.salt = newSalt;
  await saveSettings(settings);
  await saveVaultData(data);
}

export async function wipeVault(): Promise<void> {
  await SecureStore.deleteItemAsync(VAULT_KEY);
  await SecureStore.deleteItemAsync(SETTINGS_KEY);
  derivedEncryptionKey = null;
}

export async function isSetup(): Promise<boolean> {
  const settings = await getSettings();
  return settings !== null;
}
