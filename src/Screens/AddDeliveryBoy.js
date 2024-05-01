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
} from 'react-native';
import React, {useState} from 'react';
import NavBar from '../Components/NavBar';
import {colors} from '../Global/styles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {API} from '../utils/ApiUtils';

const AddDeliveryBoy = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    aadhaarCardNumber: '',
    mobileNumber: '',
    latitude: 22.5726,
    longitude: 88.3639,
    aadharImage: null,
    selfieImages: null,
  });

  const handleSubmit = () => {
    // Validate Aadhaar number
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(aadhaarNumber)) {
      Alert.alert('Error', 'Aadhaar number must be 12 digits numeric');
      return;
    }

    // Validate mobile number
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      Alert.alert('Error', 'Mobile number must be 10 digits numeric');
      return;
    }
  };

  const handleImageUpload = () => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      setFormData(prevState => ({
        ...prevState,
        aadharImage: response.assets[0].uri,
      }));
    });
  };

  const handlephotoUpload = async () => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };
    // try{
    // await axios.get(API+'upload/delivery/aadhar')
    // } catch(error){
    //   console.log(error)
    // }
    launchCamera(options, response => {
      setFormData(prevState => ({
        ...prevState,
        selfieImages: response.assets[0].uri,
      }));
    });
  };
  return (
    <View style={styles.container}>
      <NavBar />
      <ScrollView style={styles.subContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={text =>
            setFormData(prevState => ({
              ...prevState,
              name: text,
            }))
          }
          placeholder="Enter name"
          placeholderTextColor="#eb78eb"
        />
        <Text style={styles.label}>Mobile Number:</Text>
        <TextInput
          style={styles.input}
          value={formData.mobileNumber}
          onChangeText={text =>
            setFormData(prevState => ({
              ...prevState,
              mobileNumber: text,
            }))
          }
          placeholder="Enter mobile number"
          keyboardType="numeric"
          placeholderTextColor="#eb78eb"
          maxLength={10}
        />
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={text =>
            setFormData(prevState => ({
              ...prevState,
              age: text,
            }))
          }
          placeholder="Enter age"
          keyboardType="numeric"
          maxLength={2}
          placeholderTextColor="#eb78eb"
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={text =>
            setFormData(prevState => ({
              ...prevState,
              address: text,
            }))
          }
          placeholder="Enter address"
          placeholderTextColor="#eb78eb"
        />
        <Text style={styles.label}>Aadhaar Card Number:</Text>
        <TextInput
          style={styles.input}
          value={formData.aadhaarCardNumber}
          maxLength={14} // Adjusted maxLength to account for spaces
          onChangeText={text => {
            // Remove any non-numeric characters from the input
            const cleanedText = text.replace(/\D/g, '');
            // Insert a space after every 4 digits
            const formattedText = cleanedText.replace(/(.{4})/g, '$1 ').trim();
            // Update the state with the formatted text
            setFormData(prevState => ({
              ...prevState,
              aadhaarCardNumber: formattedText,
            }));
          }}
          placeholder="Enter Aadhaar card number"
          keyboardType="numeric"
          placeholderTextColor="#eb78eb"
        />

        {/* Upload Aadhaar Card Photo */}
        {/* Implement your code to upload Aadhaar card photo here */}
        <Text style={styles.label}>Upload Aadhaar Card Photo:</Text>
        {/* Your code for uploading photo */}
        <TouchableOpacity
          onPress={handleImageUpload}
          style={styles.uploadFileBtn}>
          <Text style={styles.uploadFile}>Upload Adhaar</Text>
        </TouchableOpacity>
        <View style={styles.uploadAdharContainer}>
          {formData.aadharImage && (
            <Image style={styles.image} source={{uri: formData.aadharImage}} />
          )}
        </View>
        <Text style={styles.label}>Upload photo of Delivery Boy:</Text>
        {/* Your code for uploading photo */}
        <TouchableOpacity
          onPress={handlephotoUpload}
          style={styles.uploadFileBtn}>
          <Text style={styles.uploadFile}>Open Camera</Text>
        </TouchableOpacity>

        <View style={styles.uploadAdharContainer}>
          {formData.selfieImages && (
            <Image style={styles.image} source={{uri: formData.selfieImages}} />
          )}
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.registerBtnContainer}>
          <Text style={styles.registerBtn}>REGISTER</Text>
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
    backgroundColor: colors.MAIN_COLOR,
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#730273',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#f505f5',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#ad09ad',
    fontWeight: '700',
  },
  uploadFileBtn: {
    backgroundColor: '#ad09ad',
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
  },
  registerBtnContainer: {
    marginBottom: 40,
    marginTop: 20,
    backgroundColor: '#0783f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerBtn: {
    fontWeight: '700',
    fontSize: 20,
    color: colors.WHITE,
  },
});
