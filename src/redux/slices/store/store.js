import { configureStore } from "@reduxjs/toolkit";
import OrderReducer from "../orderSlice";
import GetProductReducer from '../getAllProductsSlice'

import confirmOrderSlice from "../confirmOrderSlice";

export const store = configureStore({
   reducer:{
    Order:OrderReducer,
    getProduct:GetProductReducer,
    confirmedProduct:confirmOrderSlice
   }
    
})