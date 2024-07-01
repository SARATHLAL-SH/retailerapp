import React,{useEffect,useCallback, useState} from 'react';
import DeliveryIcons from 'react-native-vector-icons/MaterialIcons';
import OrderID from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    Text,
    View,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    StyleSheet
  } from 'react-native';
  import {colors} from '../Global/styles';
  import { API } from '../utils/ApiUtils';
  import axios from 'axios';
 

  


  const areItemsEqual = (prevItem, nextItem) => {
    return (
      prevItem?.confirmOrder?.orderId === nextItem?.confirmOrder?.orderId &&
      JSON.stringify(prevItem?.confirmOrder?.status) === JSON.stringify(nextItem?.confirmOrder?.status)
    );
  };

    const RenderItem = ({item, index, setDataArray,setFilteredData,dataArray,filteredData}) => {
      const [isDispatched, setIsDispatched] = useState(false); 
      const dispatchHandler = async(orderId) =>{
        try {
          const response = await axios.put(`${API}confirm/orders/update/dispatched/${orderId}`);
          if (response.data) {
            // Update data state directly (assuming Redux is not used)
            const updatedDataArray = dataArray?.filter((order) => order._id !== orderId);
            const updatedFilteredData = filteredData?.filter((order) => order._id !== orderId);
            setDataArray(updatedDataArray);
            setFilteredData(updatedFilteredData);
            setIsDispatched(true); // Mark item as dispatched for UI update
          }
        } catch (error) {
          console.error('Error dispatching order:', error);
          // Handle dispatch error (e.g., display error message)
        }
      }

      return (
    <View>
      <View key={item.key} style={styles.itemContainer}>
      
        <Text style={[styles.itemText, {width: 20, color:'red'}]}>{index+1}</Text>
       
        <ScrollView >
        <View style={styles.ItemlistContainer}>
          <View style={styles.itemContent}>
           <OrderID name="identifier" size={25} color="#db7004"/>
            <Text
              style={[
                styles.itemTextMain,
                {width: Dimensions.get('screen').width * 0.28},
              ]}>{ item?.confirmOrder?.orderId}
            </Text>
           
            <DeliveryIcons name="delivery-dining" size={25} color="#db7004"/>
            <Text style={styles.itemTextMain}>{(item?.delevaryBoyId?.name)?.toUpperCase()}</Text>
           
          </View>
          <View style={styles.itemContent}>
            {item.confirmOrder?.productDetails.map((product, index) => (
              
              <View key={product._id} style={styles.itemContent}>
             
              <Image
              source={{
                uri:
                  API + 'imageswinesubcategories/' + product.images,
              }}
              style={styles.image}
            /> 
                <Text style={[styles.itemText,{width:Dimensions.get('screen').width*0.28}]}>{product.name}</Text>
                <Text style={styles.itemText}>{product.miligram} ML</Text>
                <Text style={styles.itemText}>
                  {product.quantity}  Rs {product.price}
                </Text>
              </View>
            ))}
          </View>
          <View>
          <TouchableOpacity style={styles.dispatchBtn} onPress={()=>dispatchHandler(item?._id)}><Text style={{color:'#064273',fontWeight:'700'}}> {isDispatched ? 'Dispatched' : 'Dispatch'}</Text></TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </View>
     
    </View>)
  };

  export default RenderItem;

  
const styles = StyleSheet.create({
 
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color:colors.MAIN_COLOR,
    flexWrap: 'wrap',
    
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 4,
    borderWidth:1,
    bordercolor:'#05548c',
    paddingHorizontal: 5,
    marginHorizontal:5,
    // elevation: 5,
  },
  ItemlistContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 4,
    marginHorizontal:5,
    flexWrap: 'wrap',
    backgroundColor:'#05548c',
    borderRadius:5,
   
  },
  image: {
    width: 35,
    height: 35,
    margin:5
  },
  itemTextMain: {
    fontWeight: '700',
    color: colors.WHITE,
    marginHorizontal: 5,
    fontSize:16
  },
  itemText: {
    fontWeight: '700',
    marginHorizontal: 5,
    color: '#d6ba3c',
    fontSize:14
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
  dispatchBtn:{
    backgroundColor:colors.WHITE,
    paddingHorizontal:10,
    paddingVertical:5,
    marginTop:10,
    marginHorizontal:10,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    bordercolor:'white',
    marginBottom:5
  }
  });