import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API} from '../../utils/ApiUtils';


export const fetchAllProducs = createAsyncThunk('fetchAllProducs', async () => {
  try {
    const response = await axios.get(API + 'get-all-wine-subcategories');
    return response.data;
  } catch (error) {
    throw error;
  }
});

const GetAllProductsSlice = createSlice({
  name: 'getProducts',
  initialState: {data: [], isLoader: false, isError: false},
  extraReducers: builder => {
    builder.addCase(fetchAllProducs.pending, (state, action) => {
      state.isLoader = true;
    });
    builder.addCase(fetchAllProducs.fulfilled, (state, action) => {
      state.isLoader = false;
      state.data = action.payload;
    });
    builder.addCase(fetchAllProducs.rejected, (state, action) => {
      state.isLoader = false;
      state.isError = true;
    });
  },
});

export default GetAllProductsSlice.reducer;
