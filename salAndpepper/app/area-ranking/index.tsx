import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { LineChart } from 'react-native-chart-kit';

// Type definitions
interface Crime {
  theft: number;
  assault: number;
  vandalism: number;
}

interface Neighborhood {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  safetyScore: number;
  crimes: Crime;
}

interface CommunityReport {
  id: number;
  user: string;
  comment: string;
  rating: number;
}

interface SafetyTrend {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

interface CityData {
  name: string;
  neighborhoods: Neighborhood[];
  safetyTrends: SafetyTrend;
  communityReports: CommunityReport[];
  mapRegion: Region;
}

interface CityDataMap {
  [key: string]: CityData;
}

// City Data
const cityData: CityDataMap = {
  sanFrancisco: {
    name: "San Francisco",
    neighborhoods: [
      { id: 1, name: 'Downtown', latitude: 37.7749, longitude: -122.4194, safetyScore: 85, crimes: { theft: 10, assault: 5, vandalism: 3 } },
      { id: 2, name: 'Mission District', latitude: 37.7599, longitude: -122.4148, safetyScore: 79, crimes: { theft: 14, assault: 7, vandalism: 5 } },
      { id: 3, name: 'Nob Hill', latitude: 37.7934, longitude: -122.4166, safetyScore: 92, crimes: { theft: 4, assault: 1, vandalism: 2 } },
      { id: 4, name: 'Haight-Ashbury', latitude: 37.7692, longitude: -122.4481, safetyScore: 82, crimes: { theft: 8, assault: 3, vandalism: 4 } },
    ],
    safetyTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [80, 85, 82, 88, 90, 92] }],
    },
    communityReports: [
      { id: 1, user: 'John Doe', comment: 'Very safe area, especially during the day.', rating: 5 },
      { id: 2, user: 'Jane Smith', comment: 'Some thefts reported at night.', rating: 3 },
      { id: 3, user: 'Alice Johnson', comment: 'Great community, feels secure.', rating: 4 },
    ],
    mapRegion: {
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }
  },
  
  newYork: {
    name: "New York",
    neighborhoods: [
      { id: 1, name: 'Manhattan Midtown', latitude: 40.7549, longitude: -73.9840, safetyScore: 87, crimes: { theft: 12, assault: 4, vandalism: 6 } },
      { id: 2, name: 'Brooklyn Heights', latitude: 40.6964, longitude: -73.9932, safetyScore: 91, crimes: { theft: 5, assault: 2, vandalism: 3 } },
      { id: 3, name: 'Upper East Side', latitude: 40.7736, longitude: -73.9566, safetyScore: 94, crimes: { theft: 3, assault: 1, vandalism: 2 } },
      { id: 4, name: 'Greenwich Village', latitude: 40.7347, longitude: -74.0014, safetyScore: 88, crimes: { theft: 7, assault: 3, vandalism: 4 } },
    ],
    safetyTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [83, 86, 89, 90, 88, 92] }],
    },
    communityReports: [
      { id: 1, user: 'Mike Richards', comment: 'Well-lit streets, feel safe walking at night.', rating: 5 },
      { id: 2, user: 'Sarah Chen', comment: 'Good police presence, quick response times.', rating: 4 },
      { id: 3, user: 'Tom Wilson', comment: 'Some issues with pickpockets in touristy areas.', rating: 3 },
    ],
    mapRegion: {
      latitude: 40.7128,
      longitude: -74.0060,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15,
    }
  },
  
  chicago: {
    name: "Chicago",
    neighborhoods: [
      { id: 1, name: 'The Loop', latitude: 41.8832, longitude: -87.6316, safetyScore: 83, crimes: { theft: 15, assault: 8, vandalism: 7 } },
      { id: 2, name: 'Lincoln Park', latitude: 41.9214, longitude: -87.6463, safetyScore: 90, crimes: { theft: 6, assault: 2, vandalism: 3 } },
      { id: 3, name: 'Wicker Park', latitude: 41.9088, longitude: -87.6766, safetyScore: 84, crimes: { theft: 9, assault: 4, vandalism: 5 } },
      { id: 4, name: 'Hyde Park', latitude: 41.7943, longitude: -87.5917, safetyScore: 86, crimes: { theft: 7, assault: 3, vandalism: 4 } },
    ],
    safetyTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [75, 78, 82, 85, 87, 89] }],
    },
    communityReports: [
      { id: 1, user: 'David Miller', comment: 'Neighborhood watch is very active and effective.', rating: 5 },
      { id: 2, user: 'Lauren Adams', comment: 'Some concerns after dark in certain areas.', rating: 3 },
      { id: 3, user: 'Robert Chen', comment: 'Overall good experience, community is watchful.', rating: 4 },
    ],
    mapRegion: {
      latitude: 41.8781,
      longitude: -87.6298,
      latitudeDelta: 0.12,
      longitudeDelta: 0.12,
    }
  },
  
  losAngeles: {
    name: "Los Angeles",
    neighborhoods: [
      { id: 1, name: 'Downtown LA', latitude: 34.0407, longitude: -118.2468, safetyScore: 76, crimes: { theft: 18, assault: 9, vandalism: 12 } },
      { id: 2, name: 'Santa Monica', latitude: 34.0195, longitude: -118.4912, safetyScore: 89, crimes: { theft: 7, assault: 2, vandalism: 4 } },
      { id: 3, name: 'Beverly Hills', latitude: 34.0736, longitude: -118.4004, safetyScore: 95, crimes: { theft: 3, assault: 1, vandalism: 2 } },
      { id: 4, name: 'Silver Lake', latitude: 34.0839, longitude: -118.2702, safetyScore: 82, crimes: { theft: 10, assault: 4, vandalism: 6 } },
    ],
    safetyTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [72, 75, 79, 83, 85, 84] }],
    },
    communityReports: [
      { id: 1, user: 'Jessica Wong', comment: 'Love the community policing efforts here.', rating: 4 },
      { id: 2, user: 'Marcus Johnson', comment: 'Great improvements in safety over last year.', rating: 5 },
      { id: 3, user: 'Olivia Martinez', comment: 'Some property crime issues but overall good.', rating: 3 },
    ],
    mapRegion: {
      latitude: 34.0522,
      longitude: -118.2437,
      latitudeDelta: 0.18,
      longitudeDelta: 0.18,
    }
  }
};

// Component Props Interfaces
interface MapVisualizationProps {
  neighborhoods: Neighborhood[];
  mapRegion: Region;
  mapRef: React.RefObject<MapView>;
}

interface StatisticalBreakdownProps {
  neighborhoods: Neighborhood[];
}

interface TrendAnalysisProps {
  safetyTrends: SafetyTrend;
  cityName: string;
}

interface CommunityReportsProps {
  reports: CommunityReport[];
}

// Components
const MapVisualization: React.FC<MapVisualizationProps> = ({ neighborhoods, mapRegion, mapRef }) => (
  <View style={styles.mapContainer}>
    <MapView
      ref={mapRef}
      style={styles.map}
      region={mapRegion}
    >
      {neighborhoods.map((area) => (
        <Marker
          key={area.id}
          coordinate={{ latitude: area.latitude, longitude: area.longitude }}
          title={area.name}
          description={`Safety Score: ${area.safetyScore}`}
          pinColor={area.safetyScore > 90 ? 'green' : (area.safetyScore > 80 ? 'orange' : 'red')}
        />
      ))}
    </MapView>
  </View>
);

const StatisticalBreakdown: React.FC<StatisticalBreakdownProps> = ({ neighborhoods }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Crime Statistics</Text>
    {neighborhoods.map((area) => (
      <View key={area.id} style={styles.statsItem}>
        <Text style={styles.areaName}>{area.name} - Safety Score: {area.safetyScore}</Text>
        <View style={styles.crimeContainer}>
          <View style={styles.crimeItem}>
            <Text style={styles.crimeLabel}>Theft</Text>
            <Text style={styles.crimeValue}>{area.crimes.theft}</Text>
          </View>
          <View style={styles.crimeItem}>
            <Text style={styles.crimeLabel}>Assault</Text>
            <Text style={styles.crimeValue}>{area.crimes.assault}</Text>
          </View>
          <View style={styles.crimeItem}>
            <Text style={styles.crimeLabel}>Vandalism</Text>
            <Text style={styles.crimeValue}>{area.crimes.vandalism}</Text>
          </View>
        </View>
      </View>
    ))}
  </View>
);

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ safetyTrends, cityName }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Safety Trends for {cityName}</Text>
    <LineChart
      data={safetyTrends}
      width={350}
      height={220}
      yAxisSuffix="%"
      chartConfig={{
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      bezier
    />
  </View>
);

const CommunityReports: React.FC<CommunityReportsProps> = ({ reports }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Community Reports</Text>
    {reports.map((report) => (
      <View key={report.id} style={styles.reportItem}>
        <Text style={styles.reportUser}>{report.user}</Text>
        <Text>{report.comment}</Text>
        <Text>Rating: {'⭐'.repeat(report.rating)}</Text>
      </View>
    ))}
  </View>
);

// Main App Component
const AreaSafetyRankings: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('sanFrancisco');
  const mapRef = useRef<MapView>(null);
  const city = cityData[selectedCity];
  
  // Effect to update map when city changes
  useEffect(() => {
    if (mapRef.current) {
      // Animate to the new region when city changes
      mapRef.current.animateToRegion(city.mapRegion, 500);
    }
  }, [selectedCity, city.mapRegion]);
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{city.name} Safety Rankings</Text>
      
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(cityData).map((cityKey) => (
            <TouchableOpacity 
              key={cityKey} 
              style={[
                styles.tabButton,
                selectedCity === cityKey ? styles.activeTab : {}
              ]}
              onPress={() => setSelectedCity(cityKey)}
            >
              <Text 
                style={[
                  styles.tabText,
                  selectedCity === cityKey ? styles.activeTabText : {}
                ]}
              >
                {cityData[cityKey].name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView>
        <MapVisualization 
          neighborhoods={city.neighborhoods} 
          mapRegion={city.mapRegion} 
          mapRef={mapRef}
        />
        <StatisticalBreakdown neighborhoods={city.neighborhoods} />
        <TrendAnalysis safetyTrends={city.safetyTrends} cityName={city.name} />
        <CommunityReports reports={city.communityReports} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  tabContainer: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontWeight: '500',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  mapContainer: {
    height: 300,
    margin: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: {
    flex: 1,
  },
  section: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
  },
  areaName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  crimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  crimeItem: {
    alignItems: 'center',
    flex: 1,
  },
  crimeLabel: {
    color: '#666',
    marginBottom: 4,
  },
  crimeValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reportItem: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  reportUser: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default AreaSafetyRankings;