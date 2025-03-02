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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

// User types
enum UserType {
  REGULAR = 'regular',
  ADMIN = 'admin',
  AUTHORITY = 'authority'
}

// Authority subtypes
enum AuthorityType {
  POLICE = 'police',
  TRAFFIC_POLICE = 'traffic_police',
  NGO = 'ngo'
}

// Dummy user data with different user types and access levels
const DUMMY_USERS = [
  // Regular users
  { email: 'user@example.com', password: 'password123', userType: UserType.REGULAR, priority: 'low' },
  { email: 'john@example.com', password: 'john123', userType: UserType.REGULAR, priority: 'low' },
  {email:'0@0.com',password:'12345',UserType:UserType.REGULAR,priority:'low'},
  
  // Admin users
  { email: 'admin@example.com', password: 'admin123', userType: UserType.ADMIN, priority: 'high' },
  
  // Authority users
  { email: 'police@example.com', password: 'police123', userType: UserType.AUTHORITY, authorityType: AuthorityType.POLICE, priority: 'critical' },
  { email: 'traffic@example.com', password: 'traffic123', userType: UserType.AUTHORITY, authorityType: AuthorityType.TRAFFIC_POLICE, priority: 'high' },
  { email: 'ngo@example.com', password: 'ngo123', userType: UserType.AUTHORITY, authorityType: AuthorityType.NGO, priority: 'medium' },
];

interface AuthorityModalProps {
  visible: boolean;
  onSelectAuthority: (type: AuthorityType) => void;
  onCancel: () => void;
}

const AuthoritySelectionModal: React.FC<AuthorityModalProps> = ({ visible, onSelectAuthority, onCancel }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Authority Type</Text>
          
          <TouchableOpacity 
            style={styles.authorityOption}
            onPress={() => onSelectAuthority(AuthorityType.POLICE)}
          >
            <Text style={styles.authorityOptionText}>Police</Text>
            <Text style={styles.authorityDescription}>For law enforcement personnel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.authorityOption}
            onPress={() => onSelectAuthority(AuthorityType.TRAFFIC_POLICE)}
          >
            <Text style={styles.authorityOptionText}>Traffic Police</Text>
            <Text style={styles.authorityDescription}>For traffic management personnel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.authorityOption}
            onPress={() => onSelectAuthority(AuthorityType.NGO)}
          >
            <Text style={styles.authorityOptionText}>NGO</Text>
            <Text style={styles.authorityDescription}>For non-governmental organizations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedUserType, setSelectedUserType] = useState<UserType>(UserType.REGULAR);
  const [selectedAuthorityType, setSelectedAuthorityType] = useState<AuthorityType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAuthorityModal, setShowAuthorityModal] = useState<boolean>(false);
  
  const navigation = useNavigation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSelectUserType = (type: UserType): void => {
    setSelectedUserType(type);
    
    // If authority is selected, show the authority selection modal
    if (type === UserType.AUTHORITY) {
      setShowAuthorityModal(true);
    } else {
      setSelectedAuthorityType(null);
    }
  };

  const handleSelectAuthorityType = (type: AuthorityType): void => {
    setSelectedAuthorityType(type);
    setShowAuthorityModal(false);
  };

  const handleLogin = (): void => {
    // Input validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    // Simulate API call delay
    setTimeout(() => {
      // Find user with matching credentials and type
      const foundUser = DUMMY_USERS.find(
        (user) => 
          user.email === email && 
          user.password === password && 
          user.userType === selectedUserType &&
          (selectedUserType !== UserType.AUTHORITY || user.authorityType === selectedAuthorityType)
      );

      setIsLoading(false);

      if (foundUser) {
        router.push('/community');
        // Success - navigate to appropriate dashboard based on user type
        // console.log(Login successful as ${foundUser.userType}${foundUser.authorityType ? ` (${foundUser.authorityType}) : ''}`);
        // console.log(User has ${foundUser.priority} priority data access);

        
        
        // Alert.alert(
        //   'Login Successful', 
        //   Welcome! You're logged in as ${formatUserTypeDisplay(foundUser)}\nPriority: ${foundUser.priority.toUpperCase()},
        //   [
        //     {
        //       text: 'Continue',
        //       onPress: () => {
        //         // Navigate to appropriate dashboard based on user type
        //         // Placeholder navigation - replace with actual routes
        //         if (foundUser.userType === UserType.ADMIN) {
        //           // navigation.navigate('AdminDashboard');
        //           console.log('Navigating to Admin Dashboard');
        //         } else if (foundUser.userType === UserType.AUTHORITY) {
        //           // navigation.navigate('AuthorityDashboard', { authorityType: foundUser.authorityType });
        //           console.log(Navigating to ${foundUser.authorityType} Dashboard);
        //         } else {
        //           // navigation.navigate('UserDashboard');
        //           console.log('Navigating to User Dashboard');
        //         }
        //       }
        //     }
        //   ]
        // );
      } else {
        // Failed login
        Alert.alert('Error', 'Invalid credentials or user type');
      }
    }, 1500);
  };

  const formatUserTypeDisplay = (user: any): string => {
    if (user.userType === UserType.REGULAR) return 'Regular User';
    if (user.userType === UserType.ADMIN) return 'Administrator';
    if (user.userType === UserType.AUTHORITY) {
      if (user.authorityType === AuthorityType.POLICE) return 'Police Authority';
      if (user.authorityType === AuthorityType.TRAFFIC_POLICE) return 'Traffic Police Authority';
      if (user.authorityType === AuthorityType.NGO) return 'NGO Representative';
    }
    return '';
  };

  const navigateToRegister = (): void => {
    navigation.navigate('Register' as never);
  };

  const navigateToForgotPassword = (): void => {
    Alert.alert('Info', 'Forgot password feature coming soon');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Suno!</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.userTypeContainer}>
            <Text style={styles.inputLabel}>Login As</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  selectedUserType === UserType.REGULAR && styles.selectedUserType
                ]}
                onPress={() => handleSelectUserType(UserType.REGULAR)}
              >
                <Text 
                  style={[
                    styles.userTypeText,
                    selectedUserType === UserType.REGULAR && styles.selectedUserTypeText
                  ]}
                >
                  Regular User
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  selectedUserType === UserType.ADMIN && styles.selectedUserType
                ]}
                onPress={() => handleSelectUserType(UserType.ADMIN)}
              >
                <Text 
                  style={[
                    styles.userTypeText,
                    selectedUserType === UserType.ADMIN && styles.selectedUserTypeText
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  selectedUserType === UserType.AUTHORITY && styles.selectedUserType
                ]}
                onPress={() => handleSelectUserType(UserType.AUTHORITY)}
              >
                <Text 
                  style={[
                    styles.userTypeText,
                    selectedUserType === UserType.AUTHORITY && styles.selectedUserTypeText
                  ]}
                >
                  Authority
                </Text>
              </TouchableOpacity>
            </View>
            
            {selectedUserType === UserType.AUTHORITY && selectedAuthorityType && (
              <View style={styles.authorityTypeIndicator}>
                <Text style={styles.authorityTypeText}>
                  Selected: {selectedAuthorityType === AuthorityType.POLICE ? 'Police' : 
                            selectedAuthorityType === AuthorityType.TRAFFIC_POLICE ? 'Traffic Police' : 'NGO'}
                </Text>
                <TouchableOpacity onPress={() => setShowAuthorityModal(true)}>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
            )}
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={navigateToForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              (selectedUserType === UserType.AUTHORITY && !selectedAuthorityType) && styles.disabledButton
            ]}
            onPress={handleLogin}
            disabled={isLoading || (selectedUserType === UserType.AUTHORITY && !selectedAuthorityType)}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>

      <AuthoritySelectionModal
        visible={showAuthorityModal}
        onSelectAuthority={handleSelectAuthorityType}
        onCancel={() => setShowAuthorityModal(false)}
      />
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
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A80F0',
  },
  formContainer: {
    width: '100%',
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
    marginBottom: 30,
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedUserType: {
    backgroundColor: '#4A80F0',
    borderColor: '#4A80F0',
  },
  userTypeText: {
    fontWeight: '500',
    color: '#666666',
  },
  selectedUserTypeText: {
    color: '#FFFFFF',
  },
  authorityTypeIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },
  authorityTypeText: {
    color: '#333333',
    fontWeight: '500',
  },
  changeText: {
    color: '#4A80F0',
    fontWeight: '500',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#4A80F0',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLink: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  authorityOption: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  authorityOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  authorityDescription: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;