import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import CrimeReportScreen from "./crimeUpload/index"
import CrimeInfoScreen from "./crimeUpload/crime-info-screen"

const Stack = createStackNavigator()

export default function main() {
  return (
    <SafeAreaProvider>
        <Stack.Navigator initialRouteName="CrimeReport" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="CrimeReport" component={CrimeReportScreen} />
          <Stack.Screen name="CrimeInfo" component={CrimeInfoScreen} />
        </Stack.Navigator>
    </SafeAreaProvider>
  )
}