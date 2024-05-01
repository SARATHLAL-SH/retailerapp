import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {API} from '../utils/ApiUtils';
import {colors} from '../Global/styles';

const ConfirmedOrders = () => {
  const [showDeliveryDetails, setShowDeliveryDetails] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [searchText, setSearchText] = useState('');

  const handleSearch = text => {
    setSearchText(text);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        API + 'get-accept-order-array/661597712a93792d53b32449',
      );

      if (response.data) {
        const responseData = response.data.orders;
        const dataArray = responseData?.map((item, index) => ({
          key: index,
          acceptOrder: item.acceptOrder,
        }));
        setDataArray(dataArray);
        setShowDeliveryDetails(new Array(dataArray.length).fill(false));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const orderConformHandler = (orderId, index) => {
    console.log('Order confirmed for ID:', orderId);
    const newShowDeliveryDetails = [...showDeliveryDetails];
    newShowDeliveryDetails[index] = !newShowDeliveryDetails[index];
    setShowDeliveryDetails(newShowDeliveryDetails);
  };
  const renderItem = ({item, index}) => (
    <View>
      <View key={item.key} style={styles.itemContainer}>
        <Text style={[styles.itemText, {width: 20}]}>{item.key + 1}</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.itemContent}>
            <Image
              source={{
                uri:
                  API + 'imageswinesubcategories/' + item?.acceptOrder?.images,
              }}
              style={styles.image}
            />
            <Text
              style={[
                styles.itemTextMain,
                {width: Dimensions.get('screen').width * 0.28},
              ]}>
              {item?.acceptOrder?.name}
            </Text>
            <Text style={styles.itemText}>{item?.quantity}</Text>
            <Text style={styles.itemText}>
              {item?.acceptOrder?.miligram} ML
            </Text>
            <Text style={styles.itemText}>₹{item?.acceptOrder?.price}</Text>
            <TouchableOpacity
              onPress={() => orderConformHandler(item?._id, index)}>
              <Text style={styles.acceptText}>Deliver</Text>
            </TouchableOpacity>

            <Text style={styles.itemText}>{item?._id}</Text>
          </View>
        </ScrollView>
      </View>
      {showDeliveryDetails[index] && (
        // <FlatList
        //   data={item.deliveryBoys}
        //   renderItem={({ item }) => (
        //     <View style={styles.deliveryBoyContainer}>
        //       <Text>name</Text>
        //       {/* Render other delivery boy details here */}
        //     </View>
        //   )}
        //   keyExtractor={(item, index) => index.toString()}
        // />
        <Text>delivery boy</Text>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Order ID"
          onChangeText={handleSearch} maxLength={4} keyboardType='numeric'
          value={searchText}
        />
        <TouchableOpacity style={styles.clearBtnContainer} onPress={()=>{setSearchText('')}}>
        <Text style={styles.clearBtn}>CLEAR</Text>
        </TouchableOpacity>
        
      </View>
      <FlatList
        data={dataArray}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

export default ConfirmedOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    height: Dimensions.get('screen').height * 0.08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    elevation: 10,
    backgroundColor: '#05548c',
    borderBottomColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#79f7e7',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
    width:Dimensions.get('screen').width * 0.4,
    fontSize:16,
    fontWeight:'700',
    color:colors.BLACK 
  },
  clearBtnContainer:{
    paddingVertical: 5,
    backgroundColor:'#099684',
    marginHorizontal:8,
    paddingHorizontal:6,
    borderRadius:5
  },
  clearBtn:{
    fontSize:16,
    fontWeight:'700',
    color:colors.WHITE 
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#0af07d',
    backgroundColor: '#099684',
    paddingHorizontal: 5,
    elevation: 20,
  },
  image: {
    width: 25,
    height: 25,
  },
  itemTextMain: {
    fontWeight: '700',
    color: colors.WHITE,
    marginHorizontal: 5,
    fontSize:16
  },
  itemText: {
    fontWeight: '700',
    color: colors.WHITE,
    marginHorizontal: 5,
  },
  acceptText: {
    color: '#113003',
    fontWeight: '700',
    fontSize: 20,
    marginHorizontal: 10,
  },
  declineText: {
    color: 'red',
    fontWeight: '700',
  },
});
