import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import cartReducer from './cart/cartSlice';
import userReducer from './user/userSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer
  },
  middleware: [thunk],
});
