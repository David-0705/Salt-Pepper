import React from 'react';
import { Image } from 'react-native';
import { Link, router } from "expo-router";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { push } from 'expo-router/build/global-state/routing';

const { width } = Dimensions.get('window');

const BottomNavbar = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNavbar}>
          <View style={styles.navbarContent}>
            
          <TouchableOpacity onPress={() => router.push("/community")} style={styles.navItem}>
  <Image source={require("../assets/images/communities.png")} style={{ width: 24, height: 24 }} />
  <Text style={styles.navText}>Community</Text>
</TouchableOpacity>;
          
            
            <TouchableOpacity  onPress={() => router.push("/main")} style={styles.navItem}>
              <Ionicons name="cloud-upload-outline" size={24} color="white" />
              <Text style={styles.navText}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => router.push("/area-ranking")}>
              <Ionicons name="cloud-upload-outline" size={24} color="white" />
              <Text style={styles.navText}>Area</Text>
              </TouchableOpacity>
            
            
            
            
            
            {/* <TouchableOpacity style={styles.navItem}>
              <Ionicons name="person-circle-outline" size={24} color="white" />
              <Text style={styles.navText}>Account</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  container: {
    flex: 1,
    position: 'relative',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#333',
  },
  bottomNavbar: {
    width: width+20,
    position: 'absolute',
  
    bottom: 0,
    
    backgroundColor: '#333',
    paddingBottom: Platform.OS === 'ios' ? (Platform.isPad ? 0 : 20) : 0,
    borderTopWidth: 1,
    borderTopColor: '#444',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  

  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 2,
  },
  navText: {
    color: 'white',
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
  }
});

export default BottomNavbar;