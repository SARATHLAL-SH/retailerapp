import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import React, {useState,useCallback,useMemo} from 'react';
import NavBar from '../Components/NavBar';
import {colors} from '../Global/styles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {API} from '../utils/ApiUtils';
import axios from 'axios';
import {
  uploadAdhaarHandler,
  uploadPhoto,
} from '../Helpers/addDeliveryBoyHelper';

const AddDeliveryBoy = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    aadhaarCardNumber: '',
    mobileNumber: '',
    aadharImage: null,
    selfieImages: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  const validateForm = () => {
    const { name, age, address, aadhaarCardNumber, mobileNumber, aadharImage, selfieImages } = formData;
    if (!name || !age || !address || !aadhaarCardNumber || !mobileNumber || !aadharImage || !selfieImages) {
      Alert.alert('Error', 'Please fill all the fields');
      return false;
    }
    if (age < 21) {
      Alert.alert('Error', 'Age must be greater than 21');
      return false;
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      Alert.alert('Error', 'Mobile number must be 10 digits numeric');
      return false;
    }
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(aadhaarCardNumber)) {
      Alert.alert('Error', 'Aadhaar number must be 12 digits numeric');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { name, age, address, aadhaarCardNumber, mobileNumber, aadharImage, selfieImages } = formData;
    try {
      const response = await axios.post(API + 'register/delivery/boy', {
        name,
        age,
        address,
        aadhaarCardNumber,
        mobileNumber,
        aadharImage,
        selfieImages,
      });
      if (response.data) {
        console.log(response.data);
      }
    } catch (error) {
      console.log('error in add delivery boy handlesubmit', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = useCallback(() => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled operation');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        handleChange('aadharImage', response.assets[0].uri);
      }
    });
  }, [handleChange]);

  const handlePhotoUpload = useCallback(() => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        handleChange('selfieImages', response.assets[0].uri);
      }
    });
  }, [handleChange]);

  const ImagePreview = useMemo(() => {
    return ({ uri }) => uri ? <Image style={styles.image} source={{ uri }} /> : null;
  }, []);

  return (
    <View style={styles.container}>
      <NavBar />
      <ScrollView style={styles.subContainer}>
        <Text style={[styles.label, { marginTop: 0 }]}>Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={text => handleChange('name', text)}
          placeholder="Enter name"
          placeholderTextColor="#a3b3b8"
        />
        <Text style={styles.label}>Mobile Number:</Text>
        <TextInput
          style={styles.input}
          value={formData.mobileNumber}
          onChangeText={text => handleChange('mobileNumber', text)}
          placeholder="Enter mobile number"
          keyboardType="numeric"
          placeholderTextColor="#a3b3b8"
          maxLength={10}
        />
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={text => handleChange('age', text)}
          placeholder="Enter age"
          keyboardType="numeric"
          placeholderTextColor="#a3b3b8"
          maxLength={2}
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={[styles.input, { height: Dimensions.get('window').height * 0.10 }]}
          value={formData.address}
          onChangeText={text => handleChange('address', text)}
          placeholder="Enter address"
          placeholderTextColor="#a3b3b8"
        />
        <Text style={styles.label}>Aadhaar Card Number:</Text>
        <TextInput
          style={styles.input}
          value={formData.aadhaarCardNumber}
          onChangeText={text => handleChange('aadhaarCardNumber', text)}
          placeholder="Enter Aadhaar card number"
          keyboardType="numeric"
          placeholderTextColor="#a3b3b8"
          maxLength={12}
        />

        <Text style={styles.label}>Upload Aadhaar Card Photo:</Text>
        <TouchableOpacity
          onPress={handleImageUpload}
          style={styles.uploadFileBtn}>
          <Text style={styles.uploadFile}>Select From Gallery</Text>
        </TouchableOpacity>
        <View style={styles.uploadAdharContainer}>
          <ImagePreview uri={formData.aadharImage} />
        </View>

        {formData.aadharImage && (
          <TouchableOpacity
            onPress={() => uploadAdhaarHandler({ aadharImage: formData.aadharImage })}
            style={styles.uploadFileBtn}>
            <Text style={styles.uploadFile}>UPLOAD</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Upload photo of Delivery Boy:</Text>
        <TouchableOpacity
          onPress={handlePhotoUpload}
          style={styles.uploadFileBtn}>
          <Text style={styles.uploadFile}>Open Camera</Text>
        </TouchableOpacity>

        <View style={styles.uploadAdharContainer}>
          <ImagePreview uri={formData.selfieImages} />
        </View>

        {formData.selfieImages && (
          <TouchableOpacity
            onPress={() => uploadPhoto({ selfieImages: formData.selfieImages })}
            style={styles.uploadFileBtn}>
            <Text style={styles.uploadFile}>UPLOAD PHOTO</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleSubmit} style={[styles.createButton]}>
          {loading ? (
            <ActivityIndicator color={colors.WHITE} />
          ) : (
            <Text style={styles.uploadFile}>CREATE ACCOUNT</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddDeliveryBoy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    // backgroundColor: '#0d1961',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderWidth:1.5,
    borderwidthColor:'white',
    margin:8,
    elevation:2
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0583ad',
    marginTop: 5,
  },
  input: {
    width: '100%',
    // heigdfht: 40,
    borderColor: '#0583ad',
    borderWidth: 1.5,
   
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#a3b3b8',
    fontWeight: '700',
    fontSize:16,
    // elevation:1,
    borderRadius: 10,
  },
  uploadFileBtn: {
    backgroundColor: '#00c2a2',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    
  },
  uploadFile: {
    fontWeight: '700',
    color: colors.WHITE,
  },
  uploadAdharContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.18,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#0e9e26',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    marginTop: 15,
  },
});
