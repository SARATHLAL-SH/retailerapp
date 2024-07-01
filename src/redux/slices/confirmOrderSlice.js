import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API} from '../../utils/ApiUtils';


export const fetchConfirmedProducts = createAsyncThunk('fetchConfirmedProducts', async () => {
  try {
    const response = await axios.get(`${API}get/order/confirmed`);
    return response.data;
  } catch (error) {
    throw error;
  }
});

const GetAllProductsSlice = createSlice({
  name: 'getConfirmedProducts',
  initialState: {data: [], isLoader: false, isError: false},
  extraReducers: builder => {
    builder.addCase(fetchConfirmedProducts.pending, (state, action) => {
      state.isLoader = true;
    });
    builder.addCase(fetchConfirmedProducts.fulfilled, (state, action) => {
      console.log('fetchConfirmedProductsSlice called in redux');
      state.isLoader = false;
      state.data = action.payload;
    });
    builder.addCase(fetchConfirmedProducts.rejected, (state, action) => {
      state.isLoader = false;
      state.isError = true;
    });
  },
});

export default GetAllProductsSlice.reducer;
