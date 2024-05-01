import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import NavBar from '../Components/NavBar';
import axios from 'axios';
import {API} from '../utils/ApiUtils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from '../Global/styles';
import {io} from 'socket.io-client';
import {WAPI} from '../utils/ApiUtils';
import {useSelector, useDispatch} from 'react-redux';
import {fetchOrders} from '../redux/slices/orderSlice';

const HomeScreen = () => {
  // const [dataArray, setDataArray] = useState([]);
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const socket = io(WAPI);
  const dispatch = useDispatch();
  const orders = useSelector(state => state?.Order?.data);
  const scrollViewRef = useRef(null);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState([]);

  useEffect(() => {
    dispatch(fetchOrders());
    setShowDeliveryDetails(new Array(dataArray.length).fill(false));
  }, [dispatch]);
  const dataArray = orders?.flatMap(item => item?.dataArray.flat());
// console.log("data in homescreen", dataArray)
  // useEffect(() => {
  //   socket.on('dataCreated', data => {
  //     setNotifications(prevNotifications => [
  //       ...prevNotifications,
  //       data.newData,
  //     ]);
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  useEffect(() => {
    socket.on('connect', () => {
      setNotifications(prevNotifications => [
        ...prevNotifications,
        `${hours}:${minutes}`,
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  
  const selectDeliveryHandler = (orderId, index) => {
    console.log('Order confirmed for ID:', orderId);
    const newShowDeliveryDetails = [...showDeliveryDetails];
    newShowDeliveryDetails[index] = !newShowDeliveryDetails[index];
    setShowDeliveryDetails(newShowDeliveryDetails);
  };

  const orderConformHandler = async (acceptOrderId,productId) => {
    try {
      console.log(acceptOrderId);
      const [postResponse, deleteResponse] = await Promise.all([
        axios.post(API + 'add-accept-order-array/', {
          acceptOrderId:productId,
          shopId: '661597712a93792d53b32449',
        }),
        axios.delete(
          API + 'delete-one-productId-customer-data-to-cart/' + acceptOrderId,
        ),
      ]);
      if (deleteResponse?.data) {
        dispatch(fetchOrders());
      }
    } catch (error) {
      console.log('error in order Conform', error);
    }
  };

  const rejectHandler = async (declineOrderId,productId) => {
    try {
      console.log("productId",declineOrderId)
      const [postResponse, deleteResponse] = await Promise.all([
        axios.post(API + 'add-decline-order-array', {
          declineOrderId:productId,
          shopId: '661597712a93792d53b32449',
        }),
        axios.delete(
          API + 'delete-one-productId-customer-data-to-cart/' + declineOrderId,
        ),
      ]);

      if (postResponse.data) {
        console.log(postResponse.data)
        dispatch(fetchOrders());
      }
      if (deleteResponse.data) {
        
        dispatch(fetchOrders());
      }
    } catch (error) {
      console.log('error in rejectHandler', error);
    }
  };

  const generateRandom4DigitNumber = () => {
      const randomNumber = Math.floor(Math.random() * 10000);
      const random4DigitNumber = randomNumber.toString().padStart(4, '0');
      return random4DigitNumber;
  };

  const handleScrollEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  useEffect(() => {
    // Optional: Set initial scroll position to 0 on component mount
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
    }
  }, []);

  const handleScroll = event => {
    console.log('Scroll position:', event.nativeEvent.contentOffset.x); // Log scroll position
  };

  const renderItem = ({item, index}) => (
    <View>
      <View style={styles.itemContainer}>
        <Text style={[styles.itemText, {color: 'red', width: 20}]}>
          {index + 1}
        </Text>

        <Image
          source={{
            uri: API + 'imageswinesubcategories/' + item?.productId?.images,
          }}
          style={styles.image}
        />

        <Text
          style={[
            styles.itemTextMain,
            {width: Dimensions.get('screen').width * 0.23},
          ]}>
          {item?.productId?.name}
        </Text>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScrollEndDrag={handleScrollEnd}
          onScroll={handleScroll}>
          <View style={styles.itemContent}>
            <Text style={styles.itemText}>{item?.quantity}</Text>
            <Text style={styles.itemText}>{item?.productId?.miligram} ML</Text>
            <Text style={styles.itemText}>₹{item?.productId?.price}</Text>
            <TouchableOpacity
              onPress={() => selectDeliveryHandler(item._id, index)}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => rejectHandler(item._id,item?.productId._id)}>
              <Text style={styles.declineText}>Decline</Text>
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
        <View style={styles.deliveryContainer}>
          <Text>delivery boy</Text>
          <TouchableOpacity style={styles.confirmBtnContainer} onPress={() => orderConformHandler(item._id,item.productId._id)}>
            <Text style={styles.confirmBtn}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <NavBar />
      <FlatList
        data={dataArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HomeScreen;

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
    borderBottomColor: '#f21378',
    backgroundColor: '#f08dba',
    paddingHorizontal: 10,
    elevation: 20,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 25,
    height: 25,
  },
  itemTextMain: {
    fontWeight: '700',
    color: '#990560',
    fontSize: 16,
    marginHorizontal: 5,
  },
  itemText: {
    fontWeight: '700',
    color: '#8f063d',
    fontSize: 14,
    marginHorizontal: 5,
  },
  acceptText: {
    color: 'green',
    fontWeight: '700',
    fontSize: 16,
    marginHorizontal: 5,
  },
  declineText: {
    color: 'red',
    fontWeight: '700',
    marginHorizontal: 5,
  },
  deliveryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  confirmBtnContainer: {
    backgroundColor: 'green',
    paddingHorizontal: 5,
  },
  confirmBtn: {
    fontWeight: '700',
    color: colors.WHITE,
  },
});
