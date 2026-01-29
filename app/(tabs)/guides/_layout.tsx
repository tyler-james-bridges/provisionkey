import { Stack } from 'expo-router';

export default function GuidesLayout() {
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
        options={{ title: 'Guides' }}
      />
      <Stack.Screen
        name="[slug]"
        options={{ title: 'Guide' }}
      />
    </Stack>
  );
}
