import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const ReportDetailScreen = ({ route }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://http://192.168.108.161:5000/api/crime-reports/${reportId}`);
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!report) {
    return <Text>Report not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crime Report Details</Text>
      <Text style={styles.description}>{report.description}</Text>
      <Text>Location: {report.location.latitude}, {report.location.longitude}</Text>
      <Text>Status: {report.status}</Text>
      <Text>Category: {report.crimeCategory}</Text>
      <Text>Severity: {report.severity}</Text>
      
      {/* Display media files */}
      <Text style={styles.mediaTitle}>Attached Media:</Text>
      <View style={styles.mediaContainer}>
        {report.media && report.media.map((media, index) => (
          media.type === 'image' ? (
            <Image
              key={index}
              source={{ uri: `http://your-server-ip:5000/api/media/${media.fileId}` }}
              style={styles.mediaImage}
              resizeMode="contain"
            />
          ) : (
            <Text key={index}>[Video file - implement video player here]</Text>
          )
        ))}
      </View>
      
      {/* Display status updates */}
      <Text style={styles.updatesTitle}>Status Updates:</Text>
      {report.statusUpdates && report.statusUpdates.map((update, index) => (
        <View key={index} style={styles.updateItem}>
          <Text>Status: {update.status}</Text>
          <Text>Notes: {update.notes}</Text>
          <Text>Date: {new Date(update.updatedAt).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  mediaContainer: {
    marginBottom: 16,
  },
  mediaImage: {
    width: '100%',
    height: 300,
    marginBottom: 8,
  },
  updatesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  updateItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
});

export default ReportDetailScreen;