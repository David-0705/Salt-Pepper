// App.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LineChart } from 'react-native-chart-kit';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// Dummy Data
const neighborhoods = [
  { id: 1, name: 'Downtown', latitude: 37.7749, longitude: -122.4194, safetyScore: 85, crimes: { theft: 10, assault: 5, vandalism: 3 } },
  { id: 2, name: 'Suburbia', latitude: 37.7849, longitude: -122.4294, safetyScore: 92, crimes: { theft: 2, assault: 1, vandalism: 1 } },
  { id: 3, name: 'Uptown', latitude: 37.7949, longitude: -122.4394, safetyScore: 78, crimes: { theft: 15, assault: 8, vandalism: 6 } },
];

const safetyTrends = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [80, 85, 82, 88, 90, 92],
    },
  ],
};

const communityReports = [
  { id: 1, user: 'John Doe', comment: 'Very safe area, especially during the day.', rating: 5 },
  { id: 2, user: 'Jane Smith', comment: 'Some thefts reported at night.', rating: 3 },
  { id: 3, user: 'Alice Johnson', comment: 'Great community, feels secure.', rating: 4 },
];

// Map Component
const MapVisualization = () => (
  <View style={styles.mapContainer}>
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {neighborhoods.map((area) => (
        <Marker
          key={area.id}
          coordinate={{ latitude: area.latitude, longitude: area.longitude }}
          title={area.name}
          description={`Safety Score: ${area.safetyScore}`}
        />
      ))}
    </MapView>
  </View>
);

// Statistical Breakdown Component
const StatisticalBreakdown = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Crime Statistics</Text>
    {neighborhoods.map((area) => (
      <View key={area.id} style={styles.statsItem}>
        <Text style={styles.areaName}>{area.name}</Text>
        <Text>Theft: {area.crimes.theft}</Text>
        <Text>Assault: {area.crimes.assault}</Text>
        <Text>Vandalism: {area.crimes.vandalism}</Text>
      </View>
    ))}
  </View>
);

// Trend Analysis Component
const TrendAnalysis = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Safety Trends Over Time</Text>
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

// Community Reports Component
const CommunityReports = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Community Reports</Text>
    {communityReports.map((report) => (
      <View key={report.id} style={styles.reportItem}>
        {/* <Icon name="person" size={20} color="#000" /> */}
        <Text style={styles.reportUser}>{report.user}</Text>
        <Text>{report.comment}</Text>
        <Text>Rating: {'⭐'.repeat(report.rating)}</Text>
      </View>
    ))}
  </View>
);

// Main App Component
const AreaSafetyRankings = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView>
      <Text style={styles.header}>Area Safety Rankings</Text>
      <MapVisualization />
      <StatisticalBreakdown />
      <TrendAnalysis />
      <CommunityReports />
    </ScrollView>
  </SafeAreaView>
);

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
  mapContainer: {
    height: 300,
    margin: 16,
  },
  map: {
    flex: 1,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsItem: {
    marginBottom: 16,
  },
  areaName: {
    fontWeight: 'bold',
  },
  reportItem: {
    marginBottom: 16,
  },
  reportUser: {
    fontWeight: 'bold',
  },
});

export default AreaSafetyRankings;