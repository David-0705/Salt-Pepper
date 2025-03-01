// src/components/SOSFeature.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AppState,
  AppStateStatus,
  Vibration,
  Platform,
  Linking
} from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

// Dummy emergency contacts data
const EMERGENCY_CONTACTS = [
  { id: '1', name: 'John Doe', phone: '+1234567890', relationship: 'Family' },
  { id: '2', name: 'Jane Smith', phone: '+0987654321', relationship: 'Friend' },
  { id: '3', name: 'Emergency Services', phone: '911', relationship: 'Emergency' },
];

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SOSFeatureProps {
  contacts?: EmergencyContact[];
  message?: string;
  includeLocation?: boolean;
  gestureThreshold?: number; // Number of taps needed to trigger SOS
  gestureTimeout?: number; // Time window for taps in milliseconds
}

const SOSFeature: React.FC<SOSFeatureProps> = ({
  contacts = EMERGENCY_CONTACTS,
  message = "I need help! This is an emergency.",
  includeLocation = true,
  gestureThreshold = 5,
  gestureTimeout = 3000,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [location, setLocation] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState<number>(0);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
  
  const lastTapTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Check location permission on mount
  useEffect(() => {
    const checkLocationPermission = async () => {
      if (includeLocation) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          setHasLocationPermission(status === 'granted');
        } catch (error) {
          console.error('Error requesting location permission:', error);
          setHasLocationPermission(false);
        }
      }
    };

    checkLocationPermission();
  }, [includeLocation]);

  // Listen for app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Reset tap counter when app goes to background or becomes active again
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
        setTapCount(0);
      }
      
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Get current location if SOS is active
  useEffect(() => {
    if (isActive && includeLocation && hasLocationPermission) {
      const getLocation = async () => {
        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(
            `Latitude: ${currentLocation.coords.latitude}, Longitude: ${currentLocation.coords.longitude}`
          );
        } catch (error) {
          console.error('Error getting location:', error);
          setLocation('Location unavailable');
        }
      };

      getLocation();
    }
  }, [isActive, includeLocation, hasLocationPermission]);

  // Handle tap for SOS gesture detection
  const handleTap = () => {
    const now = Date.now();
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Check if tap is within time window
    if (now - lastTapTime.current < gestureTimeout) {
      // Increment tap count
      const newTapCount = tapCount + 1;
      setTapCount(newTapCount);
      
      // Check if we've reached the threshold
      if (newTapCount >= gestureThreshold) {
        handleSOSTrigger();
        setTapCount(0);
        return;
      }
    } else {
      // Reset tap count if outside time window
      setTapCount(1);
    }
    
    // Set timeout to reset tap count after timeout period
    timeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, gestureTimeout);
    
    // Update last tap time
    lastTapTime.current = now;
  };

  // Trigger SOS alert
  const handleSOSTrigger = async () => {
    setIsActive(true);
    
    // Vibrate device to indicate SOS is active
    Vibration.vibrate([500, 200, 500, 200, 500]);
    
    await sendEmergencyAlerts();
  };

  // Send alerts to emergency contacts
  const sendEmergencyAlerts = async () => {
    // Get location for message if enabled
    let fullMessage = message;
    
    if (includeLocation && location) {
      fullMessage = `${message}\nMy current location: ${location}`;
    }
    
    try {
      // Check if SMS is available
      const isAvailable = await SMS.isAvailableAsync();
      
      if (isAvailable) {
        // Get all contact phone numbers
        const phoneNumbers = contacts.map(contact => contact.phone);
        
        // Send SMS
        const { result } = await SMS.sendSMSAsync(phoneNumbers, fullMessage);
        
        if (result === 'sent' || result === 'unknown') {
          Alert.alert(
            "SOS Alert Sent",
            `Emergency alerts have been sent to ${contacts.length} contacts.`,
            [{ text: "OK", onPress: () => setIsActive(false) }]
          );
        } else {
          // If SMS app was opened but we don't know if message was sent
          Alert.alert(
            "SOS Alert",
            "SMS app was opened. Please send the pre-filled message.",
            [{ text: "OK", onPress: () => setIsActive(false) }]
          );
        }
      } else {
        // Fallback to manual dialing if SMS is not available
        Alert.alert(
          "SMS Not Available",
          "Would you like to call emergency contact?",
          [
            { 
              text: "Call " + contacts[0].name, 
              onPress: () => {
                Linking.openURL(`tel:${contacts[0].phone}`);
                setIsActive(false);
              }
            },
            { 
              text: "Cancel", 
              style: "cancel",
              onPress: () => setIsActive(false)
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      
      // Fallback alert
      Alert.alert(
        "SOS Alert",
        `Emergency mode is activated. Please call emergency contacts manually.`,
        [{ text: "OK", onPress: () => setIsActive(false) }]
      );
      
      // Log the message (in a real app, you might use other communication methods)
      console.log("Emergency contacts to notify:", contacts);
      console.log("Emergency message:", fullMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS Feature</Text>
      <Text style={styles.description}>
        Tap the SOS button {gestureThreshold} times quickly to trigger an emergency alert.
      </Text>
      
      <TouchableOpacity 
        style={styles.sosButton} 
        onPress={handleTap}
        activeOpacity={0.7}
      >
        <Text style={styles.sosButtonText}>SOS</Text>
        {tapCount > 0 && (
          <View style={styles.tapCounter}>
            <Text style={styles.tapCounterText}>{tapCount}/{gestureThreshold}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.contactsContainer}>
        <Text style={styles.subtitle}>Emergency Contacts:</Text>
        {contacts.map(contact => (
          <Text key={contact.id} style={styles.contact}>
            {contact.name} ({contact.relationship}): {contact.phone}
          </Text>
        ))}
      </View>
      
      {includeLocation && !hasLocationPermission && (
        <Text style={styles.warning}>
          Location permission not granted. Your location won't be included in alerts.
        </Text>
      )}
      
      {isActive && (
        <View style={styles.activeAlert}>
          <Text style={styles.alertText}>SOS ALERT ACTIVE</Text>
          {location && <Text style={styles.locationText}>Location: {location}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  sosButton: {
    backgroundColor: '#e74c3c',
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative',
  },
  sosButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  tapCounter: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  tapCounterText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactsContainer: {
    marginBottom: 16,
  },
  contact: {
    fontSize: 14,
    marginBottom: 4,
  },
  warning: {
    color: '#e67e22',
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  activeAlert: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    alignItems: 'center',
  },
  alertText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  locationText: {
    color: 'white',
    marginTop: 8,
  },
});

export default SOSFeature;

