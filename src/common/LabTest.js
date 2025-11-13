import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios'; 
import {colors} from '../const/Colors';
import {apiCall} from '../const/api';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LabTest() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiCall.mainUrl}/labs`)
      .then(response => {
        if (response.data.success) {
          setReportData(response.data.result);
          setFilteredData(response.data.result);
        }
      })
      .catch(error => {
        console.error('Error fetching lab reports:', error);
      });
  }, []);

  useEffect(() => {
    const filtered = reportData.filter(item => 
      item.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, reportData]);

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          setSelectedImage(item.image);
          setModalVisible(true);
        }}>
        <Image
          source={{
            uri:
              item.image ||
              'https://cdn-icons-png.flaticon.com/512/194/194915.png',
          }}
          style={styles.image}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Name: </Text>
          {item.userId.name}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>Type of report: </Text>
          {item.description}
        </Text>
        <Text style={[styles.text, {marginBottom: 5}]}>
          <Text style={styles.boldText}>Price: </Text>
          {item.price}
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{`${new Date(
          item.createdAt,
        ).toLocaleString()}`}</Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="search-outline" size={50} color={colors.gray} />
      <Text style={styles.emptyText}>No items found</Text>
      <Text style={styles.emptySubText}>Try adjusting your search</Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or report type..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={renderEmptyComponent}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Image source={{uri: selectedImage}} style={styles.modalImage} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  result: {
    fontSize: 16,
    color: colors.green,
    marginTop: 5,
  },
  timeContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  time: {
    fontSize: 14,
    color: colors.gray,
  },

  text: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.darkGray,
  },
  boldText: {
    fontWeight: '500',
  },

  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.darkGray,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkGray,
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
  },
});
