import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API} from '../../utils/ApiUtils';

export const fetchOrders = createAsyncThunk('fetchOrders', async () => {
  try {
    
    const response = await axios.get(
      API + 'get-shopId-customer-data-to-cart/661597712a93792d53b32449',
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});

const OrderSlice = createSlice({
  name: 'Orders',
  initialState: {data: [], isLoader: false, isError: false},
  extraReducers: builder => {
    builder.addCase(fetchOrders.pending, (state, action) => {
      state.isLoader = true;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.isLoader = false;
      state.data = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.isLoader = false;
      state.isError = true;
    });
  },
});

export default OrderSlice.reducer;
