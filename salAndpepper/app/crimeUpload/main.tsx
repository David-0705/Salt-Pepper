import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import CrimeReportScreen from "./index"
import CrimeInfoScreen from "./crime-info-screen"

const Stack = createStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
        <Stack.Navigator initialRouteName="CrimeReport" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="CrimeReport" component={CrimeReportScreen} />
          <Stack.Screen name="CrimeInfo" component={CrimeInfoScreen} />
        </Stack.Navigator>

    </SafeAreaProvider>
  )
}

