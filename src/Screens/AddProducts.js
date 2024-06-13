import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {API} from '../utils/ApiUtils';
import {useSelector, useDispatch} from 'react-redux';
import {fetchAllProducs} from '../redux/slices/getAllProductsSlice';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {colors} from '../Global/styles';
import {launchImageLibrary} from 'react-native-image-picker';
import {addProductHandler,removeProductHandler} from '../Helpers/addProductHelpers';

const AddProducts = () => {
  const dispatch = useDispatch();
  const getAllProducts = useSelector(state => state.getProduct.data) || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [uploadImage, setUploadImage] = useState('');
  const [message, setMessage] = useState();
  const wineShopId = '661597712a93792d53b32449';
  const [addedProducts, setAddedProducts] = useState({});

  const messageHanlder = msg => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 300);
  };
  useEffect(() => {
    dispatch(fetchAllProducs());
  }, [dispatch]);
  const getProductsData = getAllProducts;
  const filteredProducts = getAllProducts.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const updateHandler = async (productName, id) => {
    if (
      description === '' ||
      description === '' ||
      // uploadImage === '' ||
      price === ''
    ) {
      console.log('fill all data');
    } else {
      console.log('editingItemIndex', editingItemIndex);
      console.log('description', description);
      console.log('uploadImage', uploadImage);
      console.log('price', price);
      console.log('prouctName', productName);
      try {
        const response = await axios.post(
          API + 'create-correction-wine-categpry/',
          {
            price: price,
            name: productName,
            description: description,
            image: uploadImage,
            wineShop: editingItemIndex,
          },
        );
        if (response.data) {
          console.log(response.data);
        }
      } catch (error) {
        console.log('error in AddProducts update Handler ', error);
      }
      Alert.alert(
        'Updation Status',
        `${productName} price updation request sent to Admin`,
        [
          {
            text: 'OK',
            onPress: () => {
              setEditingItemIndex(null);
              setDescription('');
              setPrice('');
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  console.log('editingItemIndex', editingItemIndex);

  const handleImageUpload = () => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      if (!response.didCancel) {
        if (response.assets.length > 0) {
          setUploadImage(response.assets[0].uri);
        } else {
          console.log('No image selected');
        }
      } else {
        console.log('Image upload canceled');
      }
    });
  };
  const renderItem = ({item, index}) => (
    <View style={styles.wraper}>
      {console.log('item============>', item)}
      <View style={styles.itemContainer}>
        <Image
          source={{uri: API + 'imageswinesubcategories/' + item?.images}}
          style={styles.image}
        />
        <View style={styles.mainTextContainer}>
          <Text style={styles.mainText}>{item.name}</Text>
        </View>

        <Text style={styles.commonText}>{item.miligram} ML</Text>
        <Text style={styles.commonText}>₹{item.price} </Text>

        <TouchableOpacity
          style={styles.addContainer}
          onPress={() => {
            addProductHandler(item.categoryID._id, wineShopId);
          }}>
          <Text style={styles.add}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeContainer} onPress={() => {
            removeProductHandler(item.categoryID._id, wineShopId);
          }}>
          <Icon name="pail-remove" size={17} color={colors.WHITE} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.removeContainer, {backgroundColor: '#9c6809'}]}
          onPress={() =>
            setEditingItemIndex(item._id === editingItemIndex ? null : item._id)
          }>
          <Icon name="square-edit-outline" size={17} color={colors.WHITE} />
        </TouchableOpacity>
      </View>
      {item._id === editingItemIndex && (
        <View style={styles.editContainer}>
          <TextInput
            keyboardType="numeric"
            placeholder=" Updated Price ₹"
            placeholderTextColor="#ab077c"
            style={styles.textfield}
            onChangeText={text => setPrice(text)}
          />
          <TouchableOpacity
            style={[styles.removeContainer, {backgroundColor: 'green'}]}
            onPress={handleImageUpload}>
            <Text style={{color: 'white', fontWeight: '700'}}>upload</Text>
            <Icon name="image" size={17} color={colors.WHITE} />
          </TouchableOpacity>
          <TextInput
            placeholder="Add Description "
            placeholderTextColor="#ab077c"
            style={styles.textfield}
            onChangeText={text => setDescription(text)}
          />
          <TouchableOpacity
            style={styles.updateBtnContainer}
            onPress={() => updateHandler(item?.name, item?._id)}>
            <Text style={styles.updateBtn}>UPDATE</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search by name"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        data={searchQuery ? filteredProducts : getAllProducts}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

export default AddProducts;

const styles = StyleSheet.create({
  wraper: {
    flexDirection: '',
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEE',
    borderRadius: 10,
    padding: 5,
    paddingVertical: 10,
    marginHorizontal: 2,
    elevation: 10,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 35,
    height: 35,
  },
  addContainer: {
    backgroundColor: 'green',
    marginHorizontal: 5,
    marginLeft: 10,
  },
  removeContainer: {
    backgroundColor: 'red',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  mainTextContainer: {
    marginHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
  },
  mainText: {
    color: 'black',
    textAlign: 'left',
    fontWeight: '700',
    color: '#c74606',
  },
  commonText: {
    marginHorizontal: 5,
    color: '#027344',
    fontWeight: '700',
  },
  add: {
    color: colors.WHITE,
    paddingHorizontal: 5,
    fontWeight: '700',
  },
  minus: {
    fontSize: 20,
    backgroundColor: 'green',
    textAlign: 'center',
    width: 20,
    color: colors.WHITE,
  },
  plus: {
    fontSize: 16,
    backgroundColor: 'red',
    textAlign: 'center',
    width: 20,
    color: colors.WHITE,
  },
  plusContainer: {},
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  textfield: {
    borderBottomWidth: 1,
    padding: 0,
    borderBottomColor: '#ab077c',
    color: '#ab077c',
  },
  updateBtnContainer: {
    backgroundColor: '#ab077c',
    padding: 5,
    borderRadius: 5,
    elevation: 5,
  },
  updateBtn: {
    fontWeight: '700',
    color: colors.WHITE,
  },
});
