import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {API} from '../utils/ApiUtils';
import {colors} from '../Global/styles';

const CancelledOrders = () => {
  const [dataArray, setDataArray] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        API + 'get-decline-order-array/661597712a93792d53b32449',
      );

      if (response.data) {
        const responseData = response.data.orders;
        const dataArray = responseData?.map((item, index) => ({
          key: index,
          declineOrder: item.declineOrder,
        }));
        const dataArrays = dataArray?.flatMap(item =>
          item?.declineOrder.flat(),
        );
        setDataArray(dataArrays);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const toggleDeliveryDetails = () => {};

  const renderItem = ({item, index}) => (
    <View key={item.key} style={styles.itemContainer}>
      <Text style={styles.itemText}>{index + 1}</Text>
      <Image
        source={{uri: API + 'imageswinesubcategories/' + item.images}}
        style={styles.image}
      />
      <Text
        style={[
          styles.itemTextMain,
          {width: Dimensions.get('screen').width * 0.2},
        ]}>
        {item.name}
      </Text>
      <Text style={styles.itemText}>{item.quantity}</Text>
      <Text style={styles.itemText}>{item.miligram} ML</Text>
      <Text style={styles.itemText}>₹{item.price}</Text>
      {/* <TouchableOpacity onPress={toggleDeliveryDetails}>
        <Text style={styles.acceptText}>Deliver</Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dataArray}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

export default CancelledOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#0af07d',
    backgroundColor: '#a7f2cd',
    paddingHorizontal: 10,
    elevation: 20,
  },
  image: {
    width: 25,
    height: 25,
  },
  itemTextMain: {
    fontWeight: '700',
    color: '#2507ad',
    // alignSelf:'flex-start'
  },
  itemText: {
    fontWeight: '700',
    color: '#2507ad',
  },
  acceptText: {
    color: '#024021',
    fontWeight: '700',
    fontSize: 20,
  },
  declineText: {
    color: 'red',
    fontWeight: '700',
  },
});
