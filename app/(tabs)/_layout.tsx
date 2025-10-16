import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Login"
        options={{ headerShown: true, title: "", headerTransparent: true }}
      />
      <Stack.Screen name="Register"
        options={{ headerShown: true, title: "", headerTransparent: true }}

      />
      <Stack.Screen name="UserBoard"
        options={{ headerShown: true, title: "", headerTransparent: true }}
      />
          <Stack.Screen name="EventProposal"
        options={{ headerShown: true, title: "", headerTransparent: true }}
      />
          <Stack.Screen name="Event"
        options={{ headerShown: true, title: "", headerTransparent: true }}
      />
    </Stack>


  );
}
