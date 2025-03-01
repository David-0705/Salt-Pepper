import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Dummy user data - for validation purposes
const EXISTING_EMAILS = ['user@example.com', 'john@example.com', 'demo@example.com'];

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    if (!isValid) console.log('Invalid email format:', email);
    return isValid;
  };

  const handleRegister = (): void => {
    console.log('Attempting registration...');

    // Input validation
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      console.log('Validation failed: Missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      console.log('Validation failed: Invalid email format');
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      console.log('Validation failed: Password too short');
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      console.log('Validation failed: Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (EXISTING_EMAILS.includes(email)) {
      console.log('Validation failed: Email already exists');
      Alert.alert('Error', 'Email already registered');
      return;
    }

    console.log('All validations passed! Proceeding with registration...');
    setIsLoading(true);
    Keyboard.dismiss();

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'Login',
          onPress: () => {
            console.log('Navigating to login screen');
            navigation.goBack();
          },
        },
      ]);
    }, 1500);
  };

  const navigateToLogin = (): void => {
    console.log('Navigating to login screen');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Text style={styles.passwordHint}>Must be at least 6 characters</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  passwordHint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    fontSize: 14,
    color: '#4A80F0',
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});

export default RegisterScreen;