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
import Icon from 'react-native-vector-icons/AntDesign';
import IconCross from 'react-native-vector-icons/Entypo';


const HomeScreen = () => {
  // const [dataArray, setDataArray] = useState([]);
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const socket = io(WAPI);
  const dispatch = useDispatch();
  const orders = useSelector(state => state?.Order?.data);
  const scrollViewRef = useRef(null);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState([]);
  const [productCount, setProductCount] = useState();
  const [dataArray, setDataArray] = useState();
  const [selectedDataArray, setSelectedDataArray] = useState();
  const [deliveryBoys,setDeliveryBoys] = useState()

  useEffect(() => {
    dispatch(fetchOrders());
    selectDeliveryBoyHAndler()
  }, [dispatch]);
  // console.log('orders================>', orders);
  useEffect(() => {
    if (orders && orders.data) {
      setDataArray(orders.data);
      console.log('chekcing connection');
      setShowDeliveryDetails(new Array(orders.data.length).fill(false));

      const productdetails = orders.data.flatMap(item =>
        item.productDetails ? item.productDetails.flat() : [],
      );

      setProductCount(productdetails.length);
    }
  }, [orders]);

  useEffect(() => {
    socket.on('connection', () => {
      // setNotifications(prevNotifications => [
      //   ...prevNotifications,
      //   data.newData,
      // ]);
      dispatch(fetchOrders());
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

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
    const selectedProduct = orders?.data?.filter(
      product => product._id === orderId,
    );
    const flatenSelectedData = selectedProduct.flatMap(item =>
      item.productDetails ? item.productDetails.flat() : [],
    );
    setSelectedDataArray(flatenSelectedData);
    console.log('selectedProduct', flatenSelectedData);
  };

  const orderConformHandler = async (acceptOrderId, productId) => {
    try {
      console.log(acceptOrderId);
      const [postResponse, deleteResponse] = await Promise.all([
        axios.post(API + 'add-accept-order-array/', {
          acceptOrderId: productId,
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

  const rejectHandler = async (declineOrderId, productId) => {
    try {
      console.log('productId', declineOrderId);
      const [postResponse, deleteResponse] = await Promise.all([
        axios.post(API + 'add-decline-order-array', {
          declineOrderId: productId,
          shopId: '661597712a93792d53b32449',
        }),
        axios.delete(
          API + 'delete-one-productId-customer-data-to-cart/' + declineOrderId,
        ),
      ]);

      if (postResponse.data) {
        console.log(postResponse.data);
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
  const selectDeliveryBoyHAndler = async() =>{
    try{
const response = await axios.get(API+'get/register/delivery/boy');
if(response.data){
  console.log("response of all delivery boys", response.data)
  setDeliveryBoys(response.data)
}
    }catch(error){
      console.log("errorn in HomeScreen deliveryBoyHandler", error)
    }
  } 
  const renderItem = ({item, index}) => (
    <View>
      <View style={styles.itemContainer}>
        <Text style={[styles.itemText, {color: 'red', width: 20}]}>
          {index + 1}
        </Text>

        <Text
          style={[
            styles.itemTextMain,
            {width: Dimensions.get('screen').width * 0.23},
          ]}>
          {item?.orderId}
        </Text>

        <Text style={styles.itemText}>{item?.quantity}</Text>
        <Text style={styles.itemText}>
          {item?.productId?.miligram} {productCount} items
        </Text>
        <Text style={styles.itemText}>₹{item?.grandTotalPrice}</Text>

        <TouchableOpacity
          onPress={() => selectDeliveryHandler(item._id, index)}>
          <Text style={styles.acceptText}>Details</Text>
        </TouchableOpacity>
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
          {selectedDataArray.map(product => (
            <View key={product._id} style={styles.listedProductContainer}>
              <Image
                source={{
                  uri: API + 'imageswinesubcategories/' + product?.images,
                }}
                style={styles.image}
              />
              <Text
                style={[
                  styles.listedItems,
                  {width: Dimensions.get('screen').width * 0.25},
                ]}>
                {product.name}
              </Text>
              <Text style={styles.listedItems}>{product.miligram}ML</Text>
              <Text style={styles.listedItems}>₹{product.price}</Text>
              {/* <TouchableOpacity style={{}}>
                <Icon name="checkcircle" size={18} color="green" />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{}}
                onPress={() =>
                  rejectHandler(item?._id, item?.productId?._id)
                }>
                <IconCross
                  name="circle-with-cross"
                  size={20}
                  color={colors.RED}
                />
              </TouchableOpacity>
            </View>
          ))}
       
       <TouchableOpacity
            style={styles.confirmBtnContainer}
            onPress={selectDeliveryBoyHAndler
            }>
            <Text style={styles.confirmBtn}>SELECT DELIVERY BOY</Text>
          </TouchableOpacity>
       <View>
        {deliveryBoys.map((boy)=>(
          <View key={boy._id}>
            <Text>{boy.name}</Text>
          </View>
        ))}
       </View>
          <TouchableOpacity
            style={styles.confirmBtnContainer}
            onPress={() =>
              orderConformHandler(item?._id, item?.productId?._id)
            }>
            <Text style={styles.confirmBtn}>CONFORM ALL</Text>
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
  listedItems: {
    fontWeight: '700',
    color: 'red',
  },
  deliveryContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  listedProductContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmBtnContainer: {
    backgroundColor: 'green',
    paddingHorizontal: 5,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  confirmBtn: {
    fontWeight: '700',
    color: colors.WHITE,
    paddingVertical: 5,
  },
});
