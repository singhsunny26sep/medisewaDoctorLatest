import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../const/Colors';

export default function Report() {
  const testData = [
    {
      id: '1',
      name: 'John Doe',
      mobile: '+91 9876543210',
      email: 'john.doe@example.com',
      testName: 'Complete Blood Count (CBC)',
      testImage: 'https://t4.ftcdn.net/jpg/02/11/04/53/360_F_211045328_HnemU2NVFNwDWnQtDi5JHeHVhMV1jTOr.jpg',
      labName: 'City Lab',
      labAddress: '123 Medical Street',
      testDate: '2024-03-20',
      reportFrom: 'Medisewa Lab, Delhi',
    },
    {
      id: '2',
      name: 'Jane Smith',
      mobile: '+91 9876543211',
      email: 'jane.smith@example.com',
      testName: 'Diabetes Test',
      testImage: 'https://t4.ftcdn.net/jpg/02/11/04/53/360_F_211045328_HnemU2NVFNwDWnQtDi5JHeHVhMV1jTOr.jpg',
      labName: 'Health Care Lab',
      labAddress: '456 Hospital Road',
      testDate: '2024-03-21',
      reportFrom: 'Medisewa Lab, Mumbai',
    },
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{item.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{item.mobile}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report</Text>
          <View style={styles.reportContainer}>
            <View style={styles.testImageContainer}>
              <Image
                source={{uri: item.testImage}}
                style={styles.testImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.labDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Test:</Text>
                <Text style={styles.value}>{item.testName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Lab:</Text>
                <Text style={styles.value}>{item.labName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{item.labAddress}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{item.testDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Report From:</Text>
                <Text style={styles.value}>{item.reportFrom}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={testData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.white,
  },
  listContainer: {
    padding: 12,
  },
  card: {
    backgroundColor:colors.white,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardContent: {
    padding: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 4,
  },
  reportContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  testImageContainer: {
    width: 120,
    height: 120,
  },
  testImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  labDetails: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 70,
    fontSize: 15,
    color: colors.black,
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: colors.gray,
  },
});
