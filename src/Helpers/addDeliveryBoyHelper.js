import {Alert} from 'react-native';
import axios from 'axios';
import {API} from '../utils/ApiUtils';


const uploadFile = async (fileUri, endpoint) => {
  const data = new FormData();
  data.append('file', {
    uri: fileUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${progress}%`);
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error', error);
    throw error;
  }
};

const retryUpload = async (fileUri, endpoint, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await uploadFile(fileUri, endpoint);
    } catch (error) {
      if (attempt < retries) {
        console.log(`Retrying upload (${attempt}/${retries})...`);
      } else {
        throw error;
      }
    }
  }
};

export const uploadAdhaarHandler = async ({ aadharImage }) => {
  if (!aadharImage) {
    Alert.alert('Please select an image first');
    return;
  }

  try {
    const responseData = await retryUpload(aadharImage, `${API}upload/delivery/aadhar`);
    console.log('Upload success', responseData);
    Alert.alert('Upload successful', `File uploaded: ${responseData.filename}`);
  } catch (error) {
    Alert.alert('Upload failed', 'Something went wrong while uploading the image');
  }
};

export const uploadPhoto = async ({ selfieImages }) => {
  if (!selfieImages) {
    Alert.alert('Please select an image first');
    return;
  }

  try {
    const responseData = await retryUpload(selfieImages, `${API}upload/delivery/selfie/photo`);
    console.log('Upload success', responseData);
    Alert.alert('Upload successful', `File uploaded: ${responseData.filename}`);
  } catch (error) {
    Alert.alert('Upload failed', 'Something went wrong while uploading the image');
  }
};

// export const uploadAdhaarHandler = async ({aadharImage}) => {
//   console.log('uploaded data', aadharImage);
//   if (!aadharImage) {
//     Alert.alert('Please select an image first');
//     return;
//   }

//   const data = new FormData();
//   data.append('file', {
//     uri: aadharImage,
//     name: 'photo.jpg',
//     type: 'image/jpeg',
//   });

//   try {
//     const response = await axios.post(API + 'upload/delivery/aadhar', data, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     console.log('Upload success', response.data);
//     Alert.alert(
//       'Upload successful',
//       `File uploaded: ${response.data.filename}`,
//     );
//   } catch (error) {
//     console.error('Upload error', error);
//     Alert.alert(
//       'Upload failed',
//       'Something went wrong while uploading the image',
//     );
//   }
// };

// export const uploadPhoto = async ({selfieImages}) => {
//   if (!selfieImages) {
//     Alert.alert('Please select an image first');
//     return;
//   }

//   const data = new FormData();
//   data.append('file', {
//     uri: selfieImages,
//     name: 'photo.jpg',
//     type: 'image/jpeg',
//   });

//   try {
//     const response = await axios.post(
//       API + 'upload/delivery/selfie/photo',
//       data,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       },
//     );
//     console.log('Upload success', response.data);
//     Alert.alert(
//       'Upload successful',
//       `File uploaded: ${response.data.filename}`,
//     );
//   } catch (error) {
//     console.error('Upload error', error);
//     Alert.alert(
//       'Upload failed',
//       'Something went wrong while uploading the image',
//     );
//   }
// };
