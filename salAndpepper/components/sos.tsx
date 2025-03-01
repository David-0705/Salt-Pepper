import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import RNShake from 'react-native-shake';

const emergencyContacts = [
    { name: 'John Doe', phoneNumber: '+1234567890' },
    { name: 'Jane Smith', phoneNumber: '+0987654321' },
  ];

const SOSFeature = () => {
  // Function to send SOS alerts
  const sendSOSAlert = () => {
    emergencyContacts.forEach((contact) => {
      // Display an alert for each emergency contact
      Alert.alert(
        'SOS Alert Sent',
        `An SOS alert has been sent to ${contact.name} at ${contact.phoneNumber}`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    });
  };

  // Listen for device shake events
  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      sendSOSAlert(); // Trigger SOS on shake
    });

    // Clean up the listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SOSFeature;