import {API} from '../utils/ApiUtils';
import axios from 'axios';

export const addProductHandler = async (categoryId, wineShopId) => {
  try {
    const response = await axios.post(API + 'add/available/category', {
      categoryId,
      wineShopId,
    });
    if (response.data) {
      console.log('added product', response.data);
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
    }
  } catch (error) {
    console.log('error in addProductHelpers', error);
  }
};
