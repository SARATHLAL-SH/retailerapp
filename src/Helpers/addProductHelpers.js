import { Alert } from 'react-native';
import {API} from '../utils/ApiUtils';
import axios from 'axios';




export const addProductHandler = async ( categoryId,wineShopId,) => {
  try {
    const response = await axios.post(API + 'add/available/category', {
      wineShopId,
      categoryId,
    });
    if (response.data) {
      console.log('added product', response.data);
    
      // Alert.alert('Success', 'Product added successfull');
    }
  } catch (error) {
    console.log('error in addProductHelpers', error);
  }
};

export const removeProductHandler = async (categoryId, wineShopId) => {
  try {
    const response = await axios.delete(
      `${API}delete/available/${wineShopId}/${categoryId}`,
    );
    if (response.data) {
      console.log('deleted product list', response.data);
      Alert.alert('Success', 'Product removed successfully');
      
    }
  } catch (error) {
    console.log('error in addProductHelpers', error);
  }
};
