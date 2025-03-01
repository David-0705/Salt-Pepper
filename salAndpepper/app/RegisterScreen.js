// RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {AsyncStorage} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('citizen');
  const [loading, setLoading] = useState(false);
  
  // MongoDB connection setup via your backend API
  const API_URL = 'http://10.0.2.2:3000/api';
  
  const validateForm = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    
    return true;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Special handling for authority roles
      if (userType !== 'citizen') {
        // In a real app, you would implement verification for authority roles
        Alert.alert(
          'Authority Registration',
          `Registration as ${userType} requires verification. Please contact the administrator for approval.`,
          [
            {
              text: 'Proceed Anyway',
              onPress: () => submitRegistration(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setLoading(false),
            },
          ]
        );
      } else {
        await submitRegistration();
      }
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again later.');
    }
  };
  
  const submitRegistration = async () => {
    try {
      // Make API call to your MongoDB backend
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        phone,
        password,
        role: userType
      });
      
      const { token, user } = response.data;
      
      // Store user info and token
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate based on user role
              if (user.role === 'citizen') {
                navigation.replace('CitizenDashboard');
              } else if (user.role === 'police') {
                navigation.replace('PoliceDashboard');
              } else if (user.role === 'admin') {
                navigation.replace('AdminDashboard');
              }
            }
          }
        ]
      );
    } catch (error) {
      let message = 'Registration failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }
      Alert.alert('Registration Error', message);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleUserType = (type) => {
    setUserType(type);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join our community safety network</Text>
          </View>
          
          <View style={styles.userTypeContainer}>
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'citizen' && styles.selectedUserType]}
              onPress={() => toggleUserType('citizen')}
            >
              <Text style={[styles.userTypeText, userType === 'citizen' && styles.selectedUserTypeText]}>Citizen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'police' && styles.selectedUserType]}
              onPress={() => toggleUserType('police')}
            >
              <Text style={[styles.userTypeText, userType === 'police' && styles.selectedUserTypeText]}>Police</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'admin' && styles.selectedUserType]}
              onPress={() => toggleUserType('admin')}
            >
              <Text style={[styles.userTypeText, userType === 'admin' && styles.selectedUserTypeText]}>Admin</Text>
            </TouchableOpacity>
          </View>
          
          {(userType === 'police' || userType === 'admin') && (
            <View style={styles.authorityNote}>
              <Text style={styles.authorityNoteText}>
                Note: Registration as {userType} requires verification. 
                Your account will be pending approval after registration.
              </Text>
            </View>
          )}
          
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  userTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedUserType: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  userTypeText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  selectedUserTypeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  authorityNote: {
    backgroundColor: '#fef9e7',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 30,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#f39c12',
  },
  authorityNoteText: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  registerButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  loginLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;