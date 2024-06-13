import {Alert} from 'react-native';
import axios from 'axios';
import {API} from '../utils/ApiUtils';

export const uploadAdhaarHandler = async ({aadharImage}) => {
  console.log('uploaded data', aadharImage);
  if (!aadharImage) {
    Alert.alert('Please select an image first');
    return;
  }

  const data = new FormData();
  data.append('file', {
    uri: aadharImage,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await axios.post(API + 'upload/delivery/aadhar', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Upload success', response.data);
    Alert.alert(
      'Upload successful',
      `File uploaded: ${response.data.filename}`,
    );
  } catch (error) {
    console.error('Upload error', error);
    Alert.alert(
      'Upload failed',
      'Something went wrong while uploading the image',
    );
  }
};

export const uploadPhoto = async ({selfieImages}) => {
  if (!selfieImages) {
    Alert.alert('Please select an image first');
    return;
  }

  const data = new FormData();
  data.append('file', {
    uri: selfieImages,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await axios.post(
      API + 'upload/delivery/selfie/photo',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log('Upload success', response.data);
    Alert.alert(
      'Upload successful',
      `File uploaded: ${response.data.filename}`,
    );
  } catch (error) {
    console.error('Upload error', error);
    Alert.alert(
      'Upload failed',
      'Something went wrong while uploading the image',
    );
  }
};
