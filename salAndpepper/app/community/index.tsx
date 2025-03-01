import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define types
type RootStackParamList = {
  Home: undefined;
  AreaSafetyRankings: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface CrimeByType {
  [key: string]: number;
}

interface TrendDataset {
  data: number[];
  color: (opacity: number) => string;
  strokeWidth: number;
}

interface TrendData {
  labels: string[];
  datasets: TrendDataset[];
}

interface NearbyArea {
  id: number;
  name: string;
  rating: number;
}

interface Discussion {
  id: number;
  title: string;
  author: string;
  replies: number;
  timestamp: string;
}

interface SafetyData {
  overallRating: number;
  crimesByType: CrimeByType;
  trendData: TrendData;
  nearbyAreas: NearbyArea[];
  recentDiscussions: Discussion[];
}

// Mock data - replace with API calls
const MOCK_SAFETY_DATA: SafetyData = {
  overallRating: 7.2,
  crimesByType: {
    theft: 14,
    assault: 5,
    vandalism: 12,
    burglary: 8,
    other: 6
  },
  trendData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [7.8, 7.5, 7.3, 7.0, 7.2, 7.2],
        color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
        strokeWidth: 2
      }
    ]
  },
  nearbyAreas: [
    { id: 1, name: 'Downtown', rating: 6.4 },
    { id: 2, name: 'Riverside', rating: 8.1 },
    { id: 3, name: 'Oakwood', rating: 7.8 },
    { id: 4, name: 'Westside', rating: 6.9 }
  ],
  recentDiscussions: [
    { id: 1, title: 'New streetlights on Main St', author: 'Jane D.', replies: 12, timestamp: '2h ago' },
    { id: 2, title: 'Neighborhood watch schedule', author: 'Mike T.', replies: 8, timestamp: '6h ago' },
    { id: 3, title: 'Recent car break-ins', author: 'Sarah L.', replies: 23, timestamp: '1d ago' },
    { id: 4, title: 'Community safety workshop', author: 'Officer Johnson', replies: 15, timestamp: '2d ago' }
  ]
};

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'discussions'>('overview');
  const [safetyData, setSafetyData] = useState<SafetyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Simulate API call
    const fetchData = async (): Promise<void> => {
      try {
        // Replace with actual API call
        // const response = await api.getSafetyData(currentLocation);
        setTimeout(() => {
          setSafetyData(MOCK_SAFETY_DATA);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching safety data:', err);
        setError('Failed to load safety data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderSafetyScore = (score: number): JSX.Element => {
    // Ensure score is a number
    const numericScore = typeof score === 'number' ? score : 0;
    
    let color = '#FF0000'; // Red for low scores
    if (numericScore >= 7) {
      color = '#4CAF50'; // Green for high scores
    } else if (numericScore >= 5) {
      color = '#FFC107'; // Yellow for medium scores
    }
    
    return (
      <View style={[styles.scoreContainer, { borderColor: color }]}>
        <Text style={[styles.scoreText, { color }]}>{numericScore.toFixed(1)}</Text>
        <Text style={styles.scoreLabel}>Safety Score</Text>
      </View>
    );
  };

  const renderTabContent = (): JSX.Element | null => {
    if (loading) {
      return <ActivityIndicator size="large" color="#4169E1" style={styles.loader} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!safetyData) {
      return <Text style={styles.errorText}>Unable to load community data</Text>;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.headerRow}>
              {renderSafetyScore(safetyData.overallRating)}
              <TouchableOpacity 
                style={styles.rankingsButton}
                onPress={() => navigation.navigate('AreaSafetyRankings')}
              >
                <Text style={styles.rankingsButtonText}>See Area Rankings</Text>
                <Ionicons name="chevron-forward" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Safety Trend</Text>
            {safetyData.trendData && safetyData.trendData.labels && safetyData.trendData.datasets ? (
              <LineChart
                data={safetyData.trendData}
                width={300}
                height={180}
                chartConfig={{
                  backgroundColor: '#FFF',
                  backgroundGradientFrom: '#FFF',
                  backgroundGradientTo: '#FFF',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={styles.chart}
              />
            ) : (
              <Text style={styles.errorText}>Safety trend data not available</Text>
            )}

            <Text style={styles.sectionTitle}>Crime Breakdown</Text>
            {safetyData.crimesByType ? (
              <View style={styles.crimeTypesContainer}>
                {Object.entries(safetyData.crimesByType).map(([type, count]) => (
                  <View key={type} style={styles.crimeTypeItem}>
                    <Text style={styles.crimeTypeCount}>{count}</Text>
                    <Text style={styles.crimeTypeName}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.errorText}>Crime data not available</Text>
            )}

            <Text style={styles.sectionTitle}>Nearby Areas</Text>
            {safetyData.nearbyAreas && safetyData.nearbyAreas.length > 0 ? (
              <FlatList
                data={safetyData.nearbyAreas}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View 
                    style={[
                      styles.areaCard, 
                      { 
                        backgroundColor: item.rating >= 7 ? '#E8F5E9' : 
                                        item.rating >= 5 ? '#FFF9C4' : '#FFEBEE' 
                      }
                    ]}
                  >
                    <Text style={styles.areaName}>{item.name}</Text>
                    <Text style={styles.areaRating}>{item.rating.toFixed(1)}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.errorText}>Nearby areas data not available</Text>
            )}
          </View>
        );
      
      case 'discussions':
        return (
          <View style={styles.tabContent}>
            <View style={styles.discussionHeader}>
              <Text style={styles.sectionTitle}>Community Discussions</Text>
              <TouchableOpacity style={styles.newPostButton}>
                <Ionicons name="add-circle" size={20} color="#4169E1" />
                <Text style={styles.newPostText}>New Post</Text>
              </TouchableOpacity>
            </View>
            
            {safetyData.recentDiscussions && safetyData.recentDiscussions.length > 0 ? (
              safetyData.recentDiscussions.map(discussion => (
                <TouchableOpacity key={discussion.id} style={styles.discussionItem}>
                  <Text style={styles.discussionTitle}>{discussion.title}</Text>
                  <View style={styles.discussionDetails}>
                    <Text style={styles.discussionAuthor}>Posted by {discussion.author}</Text>
                    <Text style={styles.discussionMeta}>
                      <Ionicons name="chatbubble-outline" size={14} /> {discussion.replies} • {discussion.timestamp}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.errorText}>No recent discussions available</Text>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'discussions' && styles.activeTab]}
          onPress={() => setActiveTab('discussions')}
        >
          <Text style={[styles.tabText, activeTab === 'discussions' && styles.activeTabText]}>Discussions</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    backgroundColor: '#4169E1',
    padding: 16,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4169E1'
  },
  tabText: {
    fontWeight: '500',
    color: '#757575'
  },
  activeTabText: {
    color: '#4169E1',
    fontWeight: 'bold'
  },
  contentContainer: {
    flex: 1
  },
  tabContent: {
    padding: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  scoreContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  scoreLabel: {
    fontSize: 12,
    color: '#757575'
  },
  rankingsButton: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  rankingsButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#333'
  },
  chart: {
    width: 300,
    marginVertical: 8,
    borderRadius: 16
  },
  crimeTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  crimeTypeItem: {
    width: '30%',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  crimeTypeCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4169E1'
  },
  crimeTypeName: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4
  },
  areaCard: {
    width: 120,
    height: 100,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  areaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  areaRating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  newPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  newPostText: {
    color: '#4169E1',
    fontWeight: '500',
    marginLeft: 4
  },
  discussionItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  discussionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  discussionAuthor: {
    fontSize: 12,
    color: '#757575'
  },
  discussionMeta: {
    fontSize: 12,
    color: '#757575'
  },
  loader: {
    marginTop: 50
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 20
  }
});

export default CommunityPage;