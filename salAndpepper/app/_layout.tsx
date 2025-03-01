import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
  <Stack.Screen name="community" />
  <Stack.Screen name="area-ranking" />
  <Stack.Screen name="login" />
  <Stack.Screen name="register" />
  <Stack.Screen name="CrimeReport"/>
  <Stack.Screen name="CrimeInfo"/>
  </Stack>;
}
