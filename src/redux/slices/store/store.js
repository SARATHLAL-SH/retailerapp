import { configureStore } from "@reduxjs/toolkit";
import OrderReducer from "../orderSlice";
import GetProductReducer from '../getAllProductsSlice'

export const store = configureStore({
   reducer:{
    Order:OrderReducer,
    getProduct:GetProductReducer
   }
    
})