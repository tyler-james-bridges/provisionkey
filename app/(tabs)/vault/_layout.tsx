import { Stack } from 'expo-router';

export default function VaultLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#141420' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Vault', headerShown: false }}
      />
      <Stack.Screen
        name="dashboard"
        options={{ title: 'Vault' }}
      />
      <Stack.Screen
        name="add"
        options={{ title: 'Add Entry', presentation: 'modal' }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: 'Entry Details' }}
      />
    </Stack>
  );
}
