import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {colors} from '../const/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiCall} from '../const/api';

export default function Prescription({ appointmentId, patientId }) {
  const [imageUris, setImageUris] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: true,
      mediaType: 'photo',
    })
      .then(images => {
        const newImageUris = images.map(image => image.path);
        setImageUris(prevImages => [...prevImages, ...newImageUris]);
      })
      .catch(error => {
        console.log('Image Picker Error:', error);
      });
  };

  const handleSubmit = async () => {
    if (imageUris.length === 0) return;
    setLoading(true);
    const formData = new FormData();

    imageUris.forEach((uri, index) => {
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: `prescription_${index}.jpg`,
      });
    });

    console.log('appointmentId:', appointmentId);
    console.log('patientId:', patientId);

    formData.append('appointmentId', appointmentId);
    formData.append('patientId', patientId);
    console.log('FormData:', formData);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      console.log('Using Token:', token);

      const response = await axios.post(
        `${apiCall.mainUrl}/doctors/addReceipt`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Response:', response.data);
      if (response.data.message) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      if (error.response) {
        console.error('Response Error:', error.response.data);
      } else {
        console.error('Error Message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <Image source={{uri: item}} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Image
          source={{
            uri: 'https://janakalyanhomoeopathy.com/cdn/shop/files/prescription.webp?v=1719664481',
          }}
          style={styles.imageIcon}
        />
        <Text style={styles.text}>Upload Prescription</Text>
        <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
          <Text style={styles.buttonText}>Choose Prescription Images</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={imageUris}
        horizontal={true}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.imageContainer}
        showsHorizontalScrollIndicator={false}
      />

      {imageUris.length > 0 && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  imageIcon: {
    height: 160,
    width: 160,
    borderRadius: 8,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.black,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    marginBottom: 0,
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: colors.greenCustom,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    bottom: 70,
    elevation: 3,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
