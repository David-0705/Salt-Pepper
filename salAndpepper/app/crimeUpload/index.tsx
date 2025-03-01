"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Platform,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Camera, MapPin, Upload, AlertTriangle, ChevronDown, X } from "lucide-react-native"
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location"
import MapView, { Marker } from "react-native-maps"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

type MediaItem = {
  uri: string
  type: "image" | "video"
}

type SeverityLevel = "low" | "medium" | "high"

type RootStackParamList = {
  CrimeReport: undefined
  CrimeInfo: { category: string }
}

type CrimeReportScreenNavigationProp = StackNavigationProp<RootStackParamList, "CrimeReport">

const CrimeReportScreen: React.FC = () => {
  const navigation = useNavigation<CrimeReportScreenNavigationProp>()
  const [description, setDescription] = useState("")
  const [media, setMedia] = useState<MediaItem[]>([])
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [severity, setSeverity] = useState<SeverityLevel>("medium")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [severityDropdownOpen, setSeverityDropdownOpen] = useState(false)
  const [crimeCategory, setCrimeCategory] = useState<string>("")
  const [crimeCategoryDropdownOpen, setCrimeCategoryDropdownOpen] = useState(false)

  // Mock function for onViewCrimeInfo (replace with actual implementation)
  const onViewCrimeInfo = (category: string) => {
    console.log(`Navigating to CrimeInfo screen for category: ${category}`)
    navigation.navigate("CrimeInfo", { category: category })
  }

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === "granted") {
        fetchLocation()
      }
    })()
  }, [])

  const fetchLocation = async () => {
    try {
      setLoadingLocation(true)
      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    } catch (error) {
      Alert.alert("Error", "Unable to fetch location. Please try again or enter manually.")
    } finally {
      setLoadingLocation(false)
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library to upload media.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]
      const newMedia: MediaItem = {
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      }
      setMedia([...media, newMedia])
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your camera to take photos.")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]
      const newMedia: MediaItem = {
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      }
      setMedia([...media, newMedia])
    }
  }

  const removeMedia = (index: number) => {
    const updatedMedia = [...media]
    updatedMedia.splice(index, 1)
    setMedia(updatedMedia)
  }

  const renderSeverityDropdown = () => {
    const severityOptions = [
      { value: "low", label: "Low - Non-emergency situation" },
      { value: "medium", label: "Medium - Concerning but not immediate danger" },
      { value: "high", label: "High - Emergency situation" },
    ]

    const crimeCategories = [
      { value: "domestic_violence", label: "Domestic Violence" },
      { value: "theft_burglary", label: "Theft/Burglary" },
      { value: "assault", label: "Assault" },
      { value: "vandalism", label: "Vandalism" },
      { value: "drug_related", label: "Drug-Related Crimes" },
      { value: "cybercrime", label: "Cybercrime" },
      { value: "human_trafficking", label: "Human Trafficking" },
      { value: "homicide", label: "Homicide/Murder" },
      { value: "fraud_scams", label: "Fraud/Scams" },
      { value: "hate_crimes", label: "Hate Crimes" },
      { value: "sexual_offenses", label: "Sexual Offenses" },
      { value: "arson", label: "Arson" },
      { value: "public_order", label: "Public Order Crimes" },
      { value: "kidnapping", label: "Kidnapping/Abduction" },
      { value: "corruption", label: "Corruption/Bribery" },
      { value: "gang_related", label: "Gang-Related Crimes" },
      { value: "stalking", label: "Stalking and Harassment" },
      { value: "environmental", label: "Environmental Crimes" },
      { value: "other", label: "Other" },
    ]

    return (
      <View style={styles.severityContainer}>
        <TouchableOpacity
          style={styles.severitySelector}
          onPress={() => setSeverityDropdownOpen(!severityDropdownOpen)}
        >
          <Text style={styles.severitySelectorText}>
            Severity: {severityOptions.find((option) => option.value === severity)?.label}
          </Text>
          <ChevronDown size={20} color="#555" />
        </TouchableOpacity>

        {severityDropdownOpen && (
          <View style={styles.dropdownMenu}>
            {severityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.dropdownItem, severity === option.value && styles.selectedDropdownItem]}
                onPress={() => {
                  setSeverity(option.value as SeverityLevel)
                  setSeverityDropdownOpen(false)
                }}
              >
                <Text style={[styles.dropdownItemText, severity === option.value && styles.selectedDropdownItemText]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    )
  }

  const renderCrimeCategoryDropdown = () => {
    const crimeCategories = [
      { value: "domestic_violence", label: "Domestic Violence" },
      { value: "theft_burglary", label: "Theft/Burglary" },
      { value: "assault", label: "Assault" },
      { value: "vandalism", label: "Vandalism" },
      { value: "drug_related", label: "Drug-Related Crimes" },
      { value: "cybercrime", label: "Cybercrime" },
      { value: "human_trafficking", label: "Human Trafficking" },
      { value: "homicideMurder", label: "Homicide/Murder" },
      { value: "fraud_scams", label: "Fraud/Scams" },
      { value: "hate_crimes", label: "Hate Crimes" },
      { value: "sexual_offenses", label: "Sexual Offenses" },
      { value: "arson", label: "Arson" },
      { value: "public_order_crimes", label: "Public Order Crimes" },
      { value: "kidnapping_abduction", label: "Kidnapping/Abduction" },
      { value: "corruption_bribery", label: "Corruption/Bribery" },
      { value: "gang_related_crimes", label: "Gang-Related Crimes" },
      { value: "stalking_and_harassment", label: "Stalking and Harassment" },
      { value: "environmental_crimes", label: "Environmental Crimes" },
      { value: "other", label: "Other" },
    ]

    return (
      <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categorySelector}
        onPress={() => setCrimeCategoryDropdownOpen(!crimeCategoryDropdownOpen)}
      >
        <Text style={styles.categorySelectorText}>
          {crimeCategory
            ? crimeCategories.find((cat) => cat.value === crimeCategory)?.label
            : "Select Crime Category"}
        </Text>
        <ChevronDown size={20} color="#555" />
      </TouchableOpacity>

      {crimeCategoryDropdownOpen && (
        <TouchableWithoutFeedback>
          <View style={styles.categoryDropdownMenu}>
            <ScrollView
              style={{ maxHeight: 200 }}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {crimeCategories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[styles.dropdownItem, crimeCategory === category.value && styles.selectedDropdownItem]}
                  onPress={() => {
                    setCrimeCategory(category.value);
                    setCrimeCategoryDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      crimeCategory === category.value && styles.selectedDropdownItemText,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>

    )
  }

  const viewCrimeInfo = () => {
    if (crimeCategory) {
      onViewCrimeInfo(crimeCategory)
    } else {
      Alert.alert("Please select a crime category first")
    }
  }

  const handleSubmit = () => {
    // Validate the form...
    if (!location || description.trim().length === 0 || !crimeCategory) {
      Alert.alert("Error", "Please fill in all required fields.")
      return
    }

    // Log the report data (for demonstration purposes)
    console.log({
      description,
      media,
      location,
      severity,
      crimeCategory,
      isAnonymous,
    })

    // Navigate to the CrimeInfoScreen
    navigation.navigate("CrimeInfo", { category: crimeCategory })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Report an Incident</Text>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            {loadingLocation ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Fetching your location...</Text>
              </View>
            ) : location ? (
              <>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                  />
                </MapView>
                <Text style={styles.locationText}>
                  Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}
                </Text>
              </>
            ) : (
              <TouchableOpacity style={styles.locationButton} onPress={fetchLocation}>
                <MapPin size={24} color="#4A90E2" />
                <Text style={styles.locationButtonText}>Get Current Location</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Crime Category Section */}
        <View style={styles.section}>
          <View style={styles.categoryHeaderContainer}>
            <Text style={styles.sectionTitle}>Crime Category</Text>
            {crimeCategory && (
              <TouchableOpacity style={styles.infoButton} onPress={viewCrimeInfo}>
                <Text style={styles.infoButtonText}>View Info & Helplines</Text>
              </TouchableOpacity>
            )}
          </View>
          {renderCrimeCategoryDropdown()}
        </View>

        {/* Media Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media Evidence</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
              <Camera size={24} color="#4A90E2" />
              <Text style={styles.mediaButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
              <Upload size={24} color="#4A90E2" />
              <Text style={styles.mediaButtonText}>Upload Media</Text>
            </TouchableOpacity>
          </View>

          {media.length > 0 && (
            <View style={styles.mediaPreviewContainer}>
              <Text style={styles.mediaPreviewTitle}>Uploaded Media ({media.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaPreview}>
                {media.map((item, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                    <TouchableOpacity style={styles.removeMediaButton} onPress={() => removeMedia(index)}>
                      <X size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incident Description</Text>
          <TextInput
            style={styles.descriptionInput}
            multiline
            numberOfLines={6}
            placeholder="Please provide a detailed description of what you witnessed..."
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        {/* Severity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incident Severity</Text>
          {renderSeverityDropdown()}
        </View>

        {/* Anonymous Reporting */}
        <View style={styles.section}>
          <View style={styles.anonymousContainer}>
            <View style={styles.anonymousTextContainer}>
              <Text style={styles.sectionTitle}>Anonymous Reporting</Text>
              <Text style={styles.anonymousDescription}>
                Your personal information will not be shared with the report. Location data will still be included.
              </Text>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: "#D1D1D6", true: "#4A90E2" }}
              thumbColor={Platform.OS === "android" ? "#FFFFFF" : ""}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!location || description.trim().length === 0 || !crimeCategory}
        >
          <AlertTriangle size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          In case of emergency, please call emergency services directly. This reporting tool is not a substitute for
          emergency services.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  locationContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0E1F9",
    width: "100%",
  },
  locationButtonText: {
    marginLeft: 8,
    color: "#4A90E2",
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0E1F9",
    flex: 0.48,
  },
  mediaButtonText: {
    marginLeft: 8,
    color: "#4A90E2",
    fontWeight: "500",
  },
  mediaPreviewContainer: {
    marginTop: 16,
  },
  mediaPreviewTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  mediaPreview: {
    flexDirection: "row",
  },
  mediaItem: {
    position: "relative",
    marginRight: 8,
  },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  removeMediaButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#333",
  },
  severityContainer: {
    position: "relative",
  },
  severitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FAFAFA",
  },
  severitySelectorText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownMenu: {
    position: "relative",
    top: 10,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedDropdownItem: {
    backgroundColor: "#F0F7FF",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDropdownItemText: {
    color: "#4A90E2",
    fontWeight: "500",
  },
  anonymousContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  anonymousTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  anonymousDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  categoryContainer: {
    position: "relative",
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FAFAFA",
  },
  categorySelectorText: {
    fontSize: 16,
    color: "#333",
  },
  categoryDropdownMenu: {
    position: "relative",
    top: 5,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  categoryHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoButton: {
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D0E1F9",
  },
  infoButtonText: {
    color: "#4A90E2",
    fontSize: 12,
    fontWeight: "500",
  },
})

export default CrimeReportScreen

