export interface Guide {
  slug: string;
  title: string;
  description: string;
  icon: string; // FontAwesome icon name
  category: GuideCategory;
  steps: GuideStep[];
}

export interface GuideStep {
  title: string;
  content: string;
  tip?: string;
}

export type GuideCategory = 'basics' | 'hardware' | 'software' | 'recovery';

export interface VaultEntry {
  id: string;
  name: string;
  type: VaultEntryType;
  fields: VaultField[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export type VaultEntryType = 'hardware-wallet' | 'software-wallet' | 'exchange' | 'seed-backup' | 'other';

export interface VaultField {
  label: string;
  value: string; // encrypted
  sensitive: boolean;
}

export interface VaultData {
  entries: VaultEntry[];
  version: number;
}

export interface AppSettings {
  failedAttempts: number;
  maxFailedAttempts: number;
  biometricEnabled: boolean;
  pinHash: string;
  salt: string;
}
