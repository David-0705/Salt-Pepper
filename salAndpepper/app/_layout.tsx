// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack
//   screenOptions={{
//     // Hide the header for all other routes.
//     headerShown: false,
//   }}
//   >
//     <Stack.Screen name="community" options={{ headerShown: false }} />
//     <Stack.Screen name="area-ranking" options={{ headerShown: false }} />
//     <Stack.Screen name="login" options={{ headerShown: false }} />
//     <Stack.Screen name="register" options={{ headerShown: false }} />
//     <Stack.Screen name="CrimeReport" options={{ headerShown: false }} />
//     <Stack.Screen name="CrimeInfo" options={{ headerShown: false }} />
//   </Stack>;
// }


import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />  // Your home/initial screen
      <Stack.Screen name="community/index" />
      <Stack.Screen name="area-ranking/index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="register/index" />
      <Stack.Screen name="crimeUpload/index" />
      <Stack.Screen name="crimeUpload/crime-info-screen" />
    </Stack>
  );
}