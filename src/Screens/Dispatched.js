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
import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {API} from '../utils/ApiUtils';
import {colors} from '../Global/styles';
import {useFocusEffect} from '@react-navigation/native'
import RenderItem from '../Helpers/dispatchedHelper'

 


let limit = 13;
let loadMore =true;


const Dispatched = () => {
  const [showDeliveryDetails, setShowDeliveryDetails] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [skip, setSkip] = useState(0);
 

  const fetchData = async () => {
    try {
       const responseAPI = `${API}get/order/dispatched`;
       const response = await axios.get(responseAPI);
        if (response.data) {
        const responseData = response?.data.orders;
        const limitedData = responseData.slice(skip, skip + limit);
       setDataArray(prevDataArray => [...prevDataArray, ...limitedData]);
        if(responseData?.length ===0){
        loadMore = false;
       }
        setFilteredData(responseData);
      } } catch (error) {
      console.log("error in dispatched order",error);
    }
  };
 
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
   useFocusEffect(
    useCallback(() => {
      fetchData();
     }, [])
  );

  const orderConformHandler = (orderId, index) => {
    console.log('Order confirmed for ID:', orderId);
    const newShowDeliveryDetails = [...showDeliveryDetails];
    newShowDeliveryDetails[index] = !newShowDeliveryDetails[index];
    setShowDeliveryDetails(newShowDeliveryDetails);
  };

  const renderItem = ({ index, style }) => {
    const item = searchText ? filteredData[index] : dataArray[index];
    return <RenderItem item={item} index={index} style={style} />;
  };


const onEndReachedHandler = () => {
   if (loadMore) {
    setSkip(prevSkip => prevSkip + limit);
    fetchData();
    console.log('onEndReachedHandler called',skip);
    console.log("loadMore",loadMore);
  }
 }

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
      <FlatList
  data={searchText ? filteredData?.slice().reverse() : dataArray.slice().reverse()}
  renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
  keyExtractor={(item, index) => index.toString()}
  onEndReached={onEndReachedHandler}
/>

    

    </View>
  );
}

export default Dispatched

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
    backgroundColor: '#21b8a1',
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
    color:'#21b8a1' 
  },
  })