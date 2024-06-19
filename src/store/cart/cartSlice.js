import { createSlice } from '@reduxjs/toolkit';
import { fetchCart } from '../actions/cartAction';

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

const cartReducer = cartSlice.reducer;

export { fetchCart };
export default cartReducer;