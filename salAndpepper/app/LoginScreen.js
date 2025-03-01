// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import {AsyncStorage} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('citizen'); // Default to citizen login

  // MongoDB connection setup via your backend API
    const API_URL = 'http://10.0.2.2:3000/api';

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userInfo = await AsyncStorage.getItem('userInfo');
        
        if (userToken && userInfo) {
          // Auto navigate to appropriate dashboard based on user role
          const user = JSON.parse(userInfo);
          navigation.replace(user.role === 'citizen' ? 'CitizenDashboard' : 
                            (user.role === 'police' ? 'PoliceDashboard' : 'AdminDashboard'));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Make API call to your MongoDB backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        userType
      });
      
      const { token, user } = response.data;
      
      // Store user info and token
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      
      // Navigate based on user role
      if (user.role === 'citizen') {
        navigation.replace('CitizenDashboard');
      } else if (user.role === 'police') {
        navigation.replace('PoliceDashboard');
      } else if (user.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else {
        // Default fallback
        navigation.replace('CitizenDashboard');
      }
      
    } catch (error) {
      let message = 'Login failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    // Store guest status
    AsyncStorage.setItem('userType', 'guest')
      .then(() => {
        navigation.replace('GuestDashboard');
      })
      .catch(error => {
        console.error('Error storing guest status:', error);
      });
  };

  const toggleUserType = (type) => {
    setUserType(type);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain" 
          />
          <Text style={styles.appTitle}>SafetyAlert</Text>
          <Text style={styles.appSubtitle}>Community Safety & Crime Reporting</Text>
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

        <View style={styles.formContainer}>
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={handleContinueAsGuest}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  registerLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#95a5a6',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  guestButtonText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
});

export default LoginScreen;