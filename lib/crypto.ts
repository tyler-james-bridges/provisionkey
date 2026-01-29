import * as Crypto from 'expo-crypto';

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 32;

export async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return bytesToHex(bytes);
}

export async function deriveKey(pin: string, salt: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin + salt
  );
  return digest;
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  // Multiple rounds of hashing to simulate PBKDF2
  let hash = pin + salt;
  for (let i = 0; i < 1000; i++) {
    hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      hash
    );
  }
  return hash;
}

export async function encrypt(plaintext: string, key: string): Promise<string> {
  // Use XOR-based encryption with the derived key as a simple symmetric cipher
  // In production, you'd want a proper AES implementation via native module
  const iv = await Crypto.getRandomBytesAsync(12);
  const ivHex = bytesToHex(iv);

  // Hash key to get encryption bytes
  const keyHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    key
  );

  const encoded = btoa(plaintext);
  // XOR each char with key bytes
  let encrypted = '';
  for (let i = 0; i < encoded.length; i++) {
    const charCode = encoded.charCodeAt(i);
    const keyByte = parseInt(keyHash.substring((i * 2) % 60, (i * 2) % 60 + 2), 16);
    encrypted += String.fromCharCode(charCode ^ keyByte);
  }

  return ivHex + ':' + btoa(encrypted);
}

export async function decrypt(ciphertext: string, key: string): Promise<string> {
  const [ivHex, data] = ciphertext.split(':');
  if (!ivHex || !data) throw new Error('Invalid ciphertext');

  const keyHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    key
  );

  const encrypted = atob(data);
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    const charCode = encrypted.charCodeAt(i);
    const keyByte = parseInt(keyHash.substring((i * 2) % 60, (i * 2) % 60 + 2), 16);
    decrypted += String.fromCharCode(charCode ^ keyByte);
  }

  return atob(decrypted);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
