import {StyleSheet, Text, View, FlatList, Image,TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {API} from '../utils/ApiUtils';
import {useSelector, useDispatch} from 'react-redux';
import {fetchAllProducs} from '../redux/slices/getAllProductsSlice';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {colors} from '../Global/styles';

const AddProducts = () => {
  const dispatch = useDispatch();
  const getAllProducts = useSelector(state => state.getProduct.data) || [];
  // const [count, setCount] = useState(1);
  const [counts, setCounts] = useState(() => getAllProducts.map(() => 1));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllProducs());
  }, [dispatch]);
  const getProductsData = getAllProducts;
  const filteredProducts = getAllProducts.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  const addingHandler = index => {
    const newCounts = [...counts];
    if (newCounts[index] === undefined) {
      newCounts[index] = 1;
    } else {
      newCounts[index] += 1;
    }
    setCounts(newCounts);
  };
  const removingHandler = index => {
    const newCounts = [...counts];
    newCounts[index] = newCounts[index] > 1 ? newCounts[index] - 1 : 1;
    setCounts(newCounts);
  };
  const renderItem = ({item, index}) => (
    <View>
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
          style={styles.minusContainer}
          onPress={() => removingHandler(index)}>
          <Text style={styles.minus}>-</Text>
        </TouchableOpacity>
        <Text style={styles.commonText}>{counts[index]} </Text>
        <TouchableOpacity
          style={styles.plusContainer}
          onPress={() => addingHandler(index)}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addContainer}>
          <Text style={styles.add}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeContainer}>
          <Icon name="pail-remove" size={17} color={colors.WHITE} />
        </TouchableOpacity>
      </View>
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
});
