import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCart } from '~/services/apiServices/CartService';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  if(!localStorage.getItem("accessToken")) return [];
  const res = await getCart();
  if (res.status === "success") {
    return res.data;
  } else {
    throw new Error('Failed to fetch cart');
  }
});