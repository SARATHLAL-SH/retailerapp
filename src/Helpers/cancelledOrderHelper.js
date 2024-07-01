import React,{useEffect,useCallback} from 'react';
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
      JSON.stringify(prevItem?.confirmOrder?.productDetails) === JSON.stringify(nextItem?.confirmOrder?.productDetails)
    );
  };

    const RenderItem = React.memo(({item, index}) => (
        
    <View>
      <View key={item.key} style={styles.itemContainer}>
      {console.log('cabncel order item', item)}
        <Text style={[styles.itemText,  {width: 20, color:'red'}]}>{index+1}</Text>
       
        <ScrollView >
        <View style={styles.ItemlistContainer}>
          <View style={styles.itemContent}>
          <OrderID name="identifier" size={25} color="#db7004"/>
            <Text
              style={[
                styles.itemTextMain,
                {width: Dimensions.get('screen').width * 0.28},
              ]}> { item?.declineOrder?.orderId}
            </Text>
           
            <DeliveryIcons name="delivery-dining" size={25} color="#db7004"/>
            <Text style={styles.itemTextMain}> {(item?.declineOrder?.createdAt)}</Text>
           
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
                <Text style={[styles.itemText,{width:Dimensions.get('screen').width*0.23}]}>{product.name}</Text>
                <Text style={styles.itemText}>{product.miligram} ML</Text>
                <Text style={styles.itemText}>
                  {product.quantity}  Rs {product.price}
                </Text>
              </View>
            ))}
          </View>
          
          </View>
        </ScrollView>
      </View>
     
    </View>
  ), areItemsEqual);

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
      bordercolor:'#ed6c09',
      paddingHorizontal: 5,
      marginHorizontal:5,
    },
    ItemlistContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 5,
      paddingVertical: 4,
      marginHorizontal:5,
      flexWrap: 'wrap',
      backgroundColor:'#ed6c09',
      borderRadius:5,
     
    },
    image: {
      width: 35,
      height: 35,
      margin:5
    },
    itemTextMain: {
      fontWeight: '700',
      color: '#fafafa',
      marginHorizontal: 5,
      fontSize:16
    },
    itemText: {
      fontWeight: '700',
      marginHorizontal: 5,
      color: '#f5d4ba',
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
      backgroundColor:'#14ba4e',
      paddingHorizontal:10,
      paddingVertical:5,
      marginTop:10,
      marginHorizontal:10,
      justifyContent:'center',
      alignItems:'center',
      elevation:5
    }
  });