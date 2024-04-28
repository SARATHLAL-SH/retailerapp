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

const AddDeliveryBoy = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [uploadAdhaar, setUploadAdhaar] = useState();
  const [capturedPhoto, setCapturedPhoto] = useState();

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

    // Submit the form data
    // You can send the data to your server or perform any other action here
    console.log('Form submitted:', {
      name,
      age,
      address,
      aadhaarNumber,
      mobileNumber,
      aadhaarCardPhoto,
    });
  };

  const handleImageUpload = () => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      setUploadAdhaar(response.assets[0].uri);
    });
  };

  const handlephotoUpload = () => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };

    launchCamera(options, response => {
      setCapturedPhoto(response.assets[0].uri);
    });
  };
  return (
    <View style={styles.container}>
      <NavBar />
      <ScrollView style={styles.subContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={text => setName(text)}
          placeholder="Enter name"
          placeholderTextColor="#eb78eb"
        />
        <Text style={styles.label}>Mobile Number:</Text>
        <TextInput
          style={styles.input}
          value={mobileNumber}
          onChangeText={text => setMobileNumber(text)}
          placeholder="Enter mobile number"
          keyboardType="numeric"
          placeholderTextColor="#eb78eb"
        />
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={text => setAge(text)}
          placeholder="Enter age"
          keyboardType="numeric"
          placeholderTextColor="#eb78eb"
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={text => setAddress(text)}
          placeholder="Enter address"
          placeholderTextColor="#eb78eb"
        />
        <Text style={styles.label}>Aadhaar Card Number:</Text>
        <TextInput
          style={styles.input}
          value={aadhaarNumber}
          onChangeText={text => setAadhaarNumber(text)}
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
          {uploadAdhaar && (
            <Image style={styles.image} source={{uri: uploadAdhaar}} />
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
          {capturedPhoto && (
            <Image style={styles.image} source={{uri: capturedPhoto}} />
          )}
        </View>
        <Button title="Submit" onPress={handleSubmit} />
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
});
