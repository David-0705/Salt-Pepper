import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
// import { ArrowLeft, Phone, AlertTriangle, Info, Shield, FileText, Users } from "lucide-react-native"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { getCrimeInfo } from "./crime-info"


type RootStackParamList = {
  CrimeInfo: { category: string }
}

const CrimeInfoScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RootStackParamList, "CrimeInfo">>()
  const { category } = route.params

  const crimeInfo = getCrimeInfo(category)

  const callHelpline = (number: string) => {
    Linking.openURL(`tel:${number}`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* <ArrowLeft size={24} color="#333" /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{crimeInfo.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {/* <Info size={20} color="#4A90E2" /> */}
            <Text style={styles.cardTitle}>Crime Details & Awareness</Text>
          </View>
          <Text style={styles.cardText}>{crimeInfo.description}</Text>
          <Text style={styles.cardSubtitle}>Legal Consequences:</Text>
          <Text style={styles.cardText}>{crimeInfo.legalConsequences}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {/* <Shield size={20} color="#4A90E2" /> */}
            <Text style={styles.cardTitle}>Next Steps for the Reporter</Text>
          </View>
          <Text style={styles.cardSubtitle}>Precautionary Measures:</Text>
          <Text style={styles.cardText}>{crimeInfo.precautionaryMeasures}</Text>
          <Text style={styles.cardSubtitle}>Track Report Status:</Text>
          <Text style={styles.cardText}>{crimeInfo.trackReportStatus}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {/* <Phone size={20} color="#4A90E2" /> */}
            <Text style={styles.cardTitle}>Support & Assistance</Text>
          </View>
          {/*
          {crimeInfo.helplines.map((helpline, index) => (
            <TouchableOpacity key={index} style={styles.helplineButton} onPress={() => callHelpline(helpline.number)}>
              <Phone size={20} color="#4A90E2" />
              <View style={styles.helplineInfo}>
                <Text style={styles.helplineName}>{helpline.name}</Text>
                <Text style={styles.helplineNumber}>{helpline.number}</Text>
              </View>
            </TouchableOpacity>
          ))}
          */}
          <Text style={styles.cardSubtitle}>Legal Aid/NGO Support:</Text>
          <Text style={styles.cardText}>{crimeInfo.legalAidSupport}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {/* <FileText size={20} color="#4A90E2" /> */}
            <Text style={styles.cardTitle}>Evidence & Proof Handling</Text>
          </View>
          <Text style={styles.cardSubtitle}>How to Secure Evidence:</Text>
          <Text style={styles.cardText}>{crimeInfo.secureEvidence}</Text>
          <Text style={styles.cardSubtitle}>Upload Additional Evidence:</Text>
          <Text style={styles.cardText}>{crimeInfo.uploadEvidence}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {/* <Users size={20} color="#4A90E2" /> */}
            <Text style={styles.cardTitle}>Community & Awareness</Text>
          </View>
          <Text style={styles.cardSubtitle}>Safety Tips:</Text>
          <Text style={styles.cardText}>{crimeInfo.safetyTips}</Text>
          <Text style={styles.cardSubtitle}>Emergency Contacts:</Text>
          <Text style={styles.cardText}>{crimeInfo.emergencyContacts}</Text>
        </View>
        {crimeInfo.rewardInfo && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {/* <AlertTriangle size={20} color="#4A90E2" /> */}
              <Text style={styles.cardTitle}>Reward or Encouragement</Text>
            </View>
            <Text style={styles.cardText}>{crimeInfo.rewardInfo}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
    marginTop: 12,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  helplineButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
    marginBottom: 8,
  },
  helplineInfo: {
    marginLeft: 12,
  },
  helplineName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  helplineNumber: {
    fontSize: 14,
    color: "#676",
  },
})


export default CrimeInfoScreen
