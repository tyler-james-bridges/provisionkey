import { StyleSheet, View, Text, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as LocalAuthentication from 'expo-local-authentication';
import { isSetup, setupPin, unlockWithPin, unlockWithBiometric, getSettings } from '@/lib/vault-store';

export default function VaultUnlockScreen() {
  const router = useRouter();
  const [setupComplete, setSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(10);

  useEffect(() => {
    checkSetup();
    checkBiometric();
  }, []);

  const checkSetup = async () => {
    const setup = await isSetup();
    setSetupComplete(setup);
    if (setup) {
      const settings = await getSettings();
      if (settings) {
        setFailedAttempts(settings.failedAttempts);
        setMaxAttempts(settings.maxFailedAttempts);
      }
    }
    setLoading(false);
  };

  const checkBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometric(compatible && enrolled);
  };

  const handleSetup = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    if (!isSettingUp) {
      setIsSettingUp(true);
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      setConfirmPin('');
      return;
    }

    try {
      await setupPin(pin);
      setSetupComplete(true);
      setIsSettingUp(false);
      setPin('');
      setConfirmPin('');
      Alert.alert('Success', 'Vault has been set up successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to set up vault');
    }
  };

  const handleUnlock = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'Please enter your PIN');
      return;
    }

    try {
      const success = await unlockWithPin(pin);
      if (success) {
        setPin('');
        setFailedAttempts(0);
        router.replace('/vault/dashboard');
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        setPin('');

        if (newAttempts >= maxAttempts) {
          Alert.alert(
            'Vault Wiped',
            'Too many failed attempts. All vault data has been destroyed.',
            [{ text: 'OK', onPress: () => { setSetupComplete(false); setFailedAttempts(0); } }]
          );
        } else {
          Alert.alert('Error', `Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to unlock vault');
    }
  };

  const handleBiometric = async () => {
    try {
      const success = await unlockWithBiometric();
      if (success) {
        router.replace('/vault/dashboard');
      } else {
        Alert.alert('Biometric Unlock Failed', 'Please use your PIN instead.');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed. Use your PIN.');
    }
  };

  const handlePinInput = (digit: string) => {
    if (isSettingUp && !confirmPin) {
      if (pin.length < 6) setPin(pin + digit);
    } else if (isSettingUp) {
      if (confirmPin.length < 6) setConfirmPin(confirmPin + digit);
    } else {
      if (pin.length < 6) setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    if (isSettingUp && confirmPin) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={[styles.loadingText, { marginTop: 16 }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <FontAwesome name="lock" size={64} color="#6C63FF" />
        <Text style={styles.title}>
          {setupComplete ? 'Unlock Vault' : 'Set Up Vault'}
        </Text>
        <Text style={styles.subtitle}>
          {setupComplete
            ? 'Enter your PIN to access your vault'
            : isSettingUp && !confirmPin
            ? 'Enter a PIN (4-6 digits)'
            : isSettingUp
            ? 'Confirm your PIN'
            : 'Create a secure PIN to protect your vault'}
        </Text>
      </View>

      <View style={styles.pinDisplay}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.pinDot,
              (isSettingUp && confirmPin ? confirmPin : pin).length > i && styles.pinDotFilled,
            ]}
          />
        ))}
      </View>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Pressable
            key={num}
            style={styles.keypadButton}
            onPress={() => handlePinInput(num.toString())}
          >
            <Text style={styles.keypadButtonText}>{num}</Text>
          </Pressable>
        ))}
        <Pressable
          style={styles.keypadButton}
          onPress={handleBackspace}
        >
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable
          style={styles.keypadButton}
          onPress={() => handlePinInput('0')}
        >
          <Text style={styles.keypadButtonText}>0</Text>
        </Pressable>
        {hasBiometric && setupComplete ? (
          <Pressable
            style={styles.keypadButton}
            onPress={handleBiometric}
          >
            <FontAwesome name="hand-paper-o" size={24} color="#6C63FF" />
          </Pressable>
        ) : (
          <View style={styles.keypadButton} />
        )}
      </View>

      <Pressable
        style={[styles.actionButton, (!pin || (isSettingUp && !confirmPin)) && styles.actionButtonDisabled]}
        onPress={setupComplete ? handleUnlock : handleSetup}
        disabled={!pin || (isSettingUp && !confirmPin)}
      >
        <Text style={styles.actionButtonText}>
          {setupComplete ? 'Unlock' : isSettingUp && confirmPin ? 'Confirm' : 'Continue'}
        </Text>
      </Pressable>

      {isSettingUp && (
        <Pressable
          style={styles.cancelButton}
          onPress={() => {
            setIsSettingUp(false);
            setPin('');
            setConfirmPin('');
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8888AA',
    textAlign: 'center',
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8888AA',
  },
  pinDotFilled: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  keypadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#141420',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#2A2A3A',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8888AA',
  },
  loadingText: {
    fontSize: 16,
    color: '#8888AA',
    textAlign: 'center',
  },
});
