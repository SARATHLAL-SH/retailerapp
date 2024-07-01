import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,ActivityIndicator,Animated
} from 'react-native';
import React, {useEffect, useState, useCallback,useMemo} from 'react';
import axios from 'axios';
import {API} from '../utils/ApiUtils';
import {colors} from '../Global/styles';
import {useFocusEffect} from '@react-navigation/native'
import RenderItem from '../Helpers/componentOrdersHelper';
import {FixedSizeList} from 'react-window';

// import {io} from 'socket.io-client';
// import {WAPI} from '../utils/ApiUtils';
import {useSelector, useDispatch} from  'react-redux';
import { fetchConfirmedProducts } from '../redux/slices/confirmOrderSlice';
import {debounce} from 'lodash'
import {FadeIn, Rotate} from 'react-native-animatable'
// import socketService from '../utils/socketService/soketService';
 


let limit = 8;
let loadMore =true;


const ConfirmedOrders = () => {
  const [showDeliveryDetails, setShowDeliveryDetails] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // const socket = useMemo(() => io(WAPI), []);
  const dispatch = useDispatch();
  const confirmOrder = useSelector(state => state?.getProduct?.data) || [];
 
  const handleSearch = useCallback(
    (text) => {
      setSearchText(text);
      const filtered = dataArray.filter((item) =>
         item?.confirmOrder?.orderId?.toString().startsWith(text)
      );
      setFilteredData(filtered);
    },
    [dataArray] 
  );

  const handleDispatch = () =>{
   dispatch(fetchConfirmedProducts());
  }
useEffect(()=>{
  console.log('confirmOrder called')
  dispatch(fetchConfirmedProducts()).finally(() => setInitialLoading(false));
},[dispatch])


  
  

 const onEndReachedHandler = () => {
   if (loadMore) {
    setSkip(prevSkip => prevSkip + limit);
  }
 }

useFocusEffect(
  useCallback(() => {
    setLoading(true); 
    dispatch(fetchConfirmedProducts({ limit, skip: 0 }))
      .then((response) => {
        setDataArray(response?.payload?.orders); 
        setFilteredData(response?.payload?.orders); 
        setSkip(limit); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false); 
      });
  }, [dispatch,limit,]) 
);

// 
  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Order ID"
          onChangeText={handleSearch} maxLength={6} keyboardType='numeric'
          value={searchText}
        />
        <TouchableOpacity style={styles.clearBtnContainer} onPress={()=>{setSearchText('')}}>
        <Text style={styles.clearBtn}>CLEAR</Text>
        </TouchableOpacity>
        
      </View>
      {initialLoading?
 
    <View style={styles.loadingContainer}>
    <Image source={require('../../assets/soora.png')} style={styles.loadingImage} />
     <View style={{position:'absolute'}}><ActivityIndicator size={{}} color={colors.WHITE} /></View>
    </View>
  
:
      <FlatList
  data={searchText ? filteredData?.slice().reverse() : dataArray?.slice().reverse()  }
  renderItem={({ item, index }) => <RenderItem item={item} index={index} setDataArray={setDataArray} setFilteredData={setFilteredData} dataArray={dataArray} filteredData={filteredData} />}
  keyExtractor={(item, index) => index.toString()}
  onEndReached={onEndReachedHandler}
  onEndReachedThreshold={0.5}
  ListFooterComponent={loading && <ActivityIndicator size="large" color={colors.RED} />}
/>

      } 

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
    alignItems: 'center',
    borderBottomWidth: 2,
    elevation: 10,
    backgroundColor: '#05548c',
    borderBottomColor: 'green',
    justifyContent: 'center',
    
  },
  searchInput: {
    backgroundColor:colors.WHITE,
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
    backgroundColor:colors.WHITE,
    marginHorizontal:8,
    paddingHorizontal:6,
    borderRadius:5,  
  },
  clearBtn:{
    fontSize:16,
    fontWeight:'700',
    color:'#05548c' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
    // marginBottom: 20,
  }

});
