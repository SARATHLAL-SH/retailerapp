import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert, Linking,Animated,ActivityIndicator
} from 'react-native';
import {accelerometer} from 'react-native-sensors'
import React, {useEffect, useState, useRef, useCallback} from 'react';
import NavBar from '../Components/NavBar';
import axios from 'axios';
import {API} from '../utils/ApiUtils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from '../Global/styles';
// import {io} from 'socket.io-client';
// import {WAPI} from '../utils/ApiUtils';
import {useSelector, useDispatch} from 'react-redux';
import {fetchOrders} from '../redux/slices/orderSlice';
import {useFocusEffect} from '@react-navigation/native'

import Icon from 'react-native-vector-icons/Ionicons';
import IconCross from 'react-native-vector-icons/Entypo';




const HomeScreen = () => {
  // const [dataArray, setDataArray] = useState([]);
  // const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  // const socket = io(WAPI);
  const dispatch = useDispatch();
  const orders = useSelector(state => state?.Order?.data) || [];
  const confirmOrder = useSelector(state => state?.getProduct?.data) || [];
  const scrollViewRef = useRef(null);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState([]);
  const [productCount, setProductCount] = useState();
  const [dataArray, setDataArray] = useState();
  const [selectedDataArray, setSelectedDataArray] = useState();
  const [deliveryBoys,setDeliveryBoys] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [productID, setProductId] = useState(null);
  const wineShopId = '661597712a93792d53b32449';
  const [isActive, setIsActive] =useState(false); 
  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [activeIndices, setActiveIndices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {data,isLoader, isError, error} = useSelector((state)=>state.Order)

// console.log('data from redux', data)

  useEffect(() => {
   
    selectDeliveryBoyHAndler()
  }, []);


  useFocusEffect(
    useCallback(() => {
     
      dispatch(fetchOrders())
        .then((response) => {
          setDataArray(response?.payload?.data); 
          setShowDeliveryDetails(new Array(response?.payload?.data?.length).fill(false)); 
          const productdetails = response?.payload?.data.flatMap(item => item.productDetails? item.productDetails.flat() : []);
          setProductCount(productdetails?.length ||[]);     
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
       });
    }, [dispatch,orderConformHandler]) 
  );

  
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

 

  const selectDeliveryHandler = (orderId, index) => {
    
    console.log('HomeScreen SelectDeliveryHandler function called',);
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
    // console.log('selectedProduct', flatenSelectedData);
  };

  const orderConformHandler = async (confirmOrderId) => {
    try {
     
      setIsLoading(true);
   const apiresponse = `${API}add-confirm-order`;
   console.log("api response",confirmOrderId, selectedId);
     const response= await  axios.post(`${API}add-confirm-order`,{
      confirmOrderId: confirmOrderId,
      delevaryBoyId:selectedId,
     });
        if(response?.data) {
        
         console.log("HomeScreen orderConformHandler Fucntion Called");
          {
            const deleteResponse = await axios.put(`${API}customer/orders/update/confirmed/${confirmOrderId}`);
            if (deleteResponse.data) {
              console.log('deleteResponse', deleteResponse.data);
              const updatedDataArray = dataArray.filter((order) => order._id !== confirmOrderId);
              setDataArray(updatedDataArray);
            }
            else {
              console.log('error in deleteResponse', deleteResponse.data);
            }
                     
          }
        }
       
      }catch (error) {
      console.log('error in HomeScreen orderConformHanlder', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const rejectHandler = async (declineOrderId,shopId) => {
    Alert.alert('Are you sure you want to reject this order?', '', [
      {
        text: "Cancel",
        onPress: () => console.log("Call cancelled"),
        style: "cancel"
    },
    {
        text: "OK",
        onPress: async () => {
          try {
            // console.log('productId', declineOrderId);
            const [postResponse, deleteResponse] = await Promise.all([
              axios.post(API + 'add-decline-order-array', {
                declineOrderId,
                shopId,
              }),
              
              
              axios.delete(
                `${API}wine-subcategories/${declineOrderId}`
              )
            ]);
            
            if (postResponse?.data) {
              console.log("decline order status:",postResponse?.data);
              // dispatch(fetchOrders());
            }
           
            if (deleteResponse?.data) {
              console.log('Delete Response:', deleteResponse.data);
              dispatch(fetchOrders());
            }
            else {
              console.error('Error deleting order:', deleteResponse.error);
              // Handle delete error (e.g., display message)
            }
          } catch (error) {
            console.log('error in rejectHandler', error);
          }}
    }
])}
    
  

 

  const selectDeliveryBoy = (id,prodId, index)=>{
    setSelectedId(id);
    setProductId(prodId);
    setActiveIndices((prevActiveIndices) => {
      const newActiveIndices = [index];
      return newActiveIndices;
    });
    // console.log('selectedId',selectedId);
    // console.log('prodId',prodId);
  }

  const handlePress = (mobileNumber,name,) => {
    Alert.alert(
        "Confirm Call",
        `Do you want to call  ${name}?`,
        [
            {
                text: "Cancel",
                onPress: () => console.log("Call cancelled"),
                style: "cancel"
            },
            {
                text: "OK",
                onPress: () => {Linking.openURL(`tel:${mobileNumber}`)
                 

                }
            }
        ]
    );
};
const cancelallOrderHandler = async (prodId, orderId) => {
  Alert.alert(
    "Cancel All Order",
    `Do you want to Cancel Order  ${orderId}?`,
    [
        {
            text: "Cancel",
            onPress: () => console.log("Call cancelled"),
            style: "cancel"
        },
        {
            text: "OK",
            onPress: () => {
              console.log('orderId', orderId);
        }
      }
    ]
);

}


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
  console.log("response selectDeliveryBoyHAndler in HomeScreen")
  setDeliveryBoys(response.data)
}
    }catch(error){
      console.log("errorn in HomeScreen deliveryBoyHandler", error)
    }
  } 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Include AM/PM indicator
    };
    return date.toLocaleTimeString('en-US', options); // Use 'en-US' locale for example
  };
  
  const renderItem = ({item, index}) => (
   
    <View style={{marginBottom:5}}>
   
      <View style={styles.itemContainer}>
        <Text style={[styles.itemText, {color: 'red', width: 20}]}>
          {index + 1}
        </Text>

        <Text
          style={[
            styles.itemTextMain,
           
          ]}>
          {item?.orderId}
        </Text>

        <Text style={styles.itemText}>{item?.quantity}</Text>
        <Text style={styles.itemText}>
          {item?.productId?.miligram} {productCount} Products
        </Text>
        <Text style={styles.itemText}>₹{item?.grandTotalPrice}</Text>
        <Text style={[styles.itemText,{fontSize:14,color:'red'}]}>{item?.updatedAt ? formatDate(item.updatedAt) : '--'}</Text>

        <TouchableOpacity
          onPress={() => selectDeliveryHandler(item._id, index)}>
          <Text style={styles.acceptText}>Details</Text>
        </TouchableOpacity>
      </View>
      {showDeliveryDetails[index] && (
       
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
                  {width: Dimensions.get('screen').width * 0.30},
                ]}>
                {product.name}
              </Text>
              <Text style={styles.listedItems}>{product.miligram}ML</Text>
              <Text style={styles.listedItems}>₹{product.price}</Text>
              
              <TouchableOpacity
                style={{}}
                onPress={() =>
                  rejectHandler(product?._id, wineShopId)
                }>
                <IconCross
                  name="circle-with-cross"
                  size={20}
                  color={colors.RED}
                />
              </TouchableOpacity>
            </View>
          ))}
       
       <View
            style={styles.confirmBtnContainer}
            onPress={selectDeliveryBoyHAndler
            }>
            <Text style={styles.confirmBtn}>SELECT DELIVERY BOY</Text>
          </View>
       <View>
        {deliveryBoys?.map((boy)=>(
         
          <TouchableOpacity key={boy._id} style={[styles.deliveryBoyDetailsContainer,boy._id === selectedId && item._id===productID && styles.selectedRow]} onPress={()=>selectDeliveryBoy(boy._id, item._id,index)}>
            <Text style={styles.deliveryBoyName}>{boy.name}</Text>
            <Text style={[{color:boy.status==='Not Available'?'red':'green'},styles.deliveryBoyStatus]}>{boy.status}</Text>
            <TouchableOpacity style={{flexDirection:'row'}}  onPress={() => handlePress(boy.mobileNumber,boy.name,)}>
            <Icon name="call" size={18} color="green" />
            <Text style={styles.deliveryBoyMobileNumber}>{boy.mobileNumber}</Text>
            </TouchableOpacity>
            
          </TouchableOpacity>
        ))}
       </View>
          <TouchableOpacity
            style={[styles.confirmBtnContainer,{backgroundColor:activeIndices.includes(index)?'green':'#e6ebe7'}]}
            onPress={() =>
              orderConformHandler(item?._id,) 
            }  disabled={!activeIndices.includes(index)}>
            <Text style={[styles.confirmBtn,{color:colors.WHITE}]}>CONFORM ORDER</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmBtnContainer,{backgroundColor:'red'}]}
            onPress={() =>
              cancelallOrderHandler(item?._id,item?.orderId) 
            } >
            <Text style={[styles.confirmBtn,{color:colors.WHITE}]}>Cancel All Orders</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <NavBar />
      {isLoading && (<View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>)}
      <FlatList
        data={dataArray?.slice().reverse()}
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
    marginVertical: 2,
    // borderBottomWidth: 1,
    // backgroundColor: '#7afaf6',
    paddingHorizontal: 10,
    paddingVertical: 15,
    elevation: 2,
    borderWidth:1,
    borderColor:'#7afaf6',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 35,
    height: 35,
  },
  itemTextMain: {
    fontWeight: '700',
    color: '#c46512',
    fontSize: 16,
    marginHorizontal: 5,
  },
  itemText: {
    fontWeight: '700',
    color: '#8f063d',
    fontSize: 16,
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
    backgroundColor:'#f0fff4'
  },
  listedProductContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'#e3fceb',
    paddingVertical: 5,
    borderBottomWidth:1,
    borderBottomColor:'#b9f0c9',
  },
  confirmBtnContainer: {
    // backgroundColor: 'green',
    paddingHorizontal: 5,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderColor:colors.GREEN,
    borderWidth: 1,
    
  },
  confirmBtn: {
    fontWeight: '700',
    color: 'green',
    paddingVertical: 5,
  },
  deliveryBoyDetailsContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingVertical:10,
    backgroundColor: '#f7f2e4',
    marginVertical:2,
    borderWidth:1,
    borderColor:'#e8e8e8',
  },
  deliveryBoyName:{
    width: Dimensions.get('screen').width * 0.35,
    fontWeight: '700',
    color: '#209ffa',
  },
  deliveryBoyStatus:{
    fontWeight: '700',
    
  },
  deliveryBoyMobileNumber:{
    fontWeight: '700',
    color: '#cf9204',
  },
  selectedRow: {
        backgroundColor: '#f0e5c7', 
    },
    loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
});
