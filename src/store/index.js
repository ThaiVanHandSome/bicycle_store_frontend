import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import cartReducer from './cart/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: [thunk],
});
