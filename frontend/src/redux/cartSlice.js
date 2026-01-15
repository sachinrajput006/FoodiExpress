import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async ({ items, deliveryAddress, specialInstructions }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/orders/', {
        items,
        delivery_address: deliveryAddress,
        special_instructions: specialInstructions,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    Additem: (state, action) => {
      let existItem = state.find((item) => item.id === action.payload.id);
      if (existItem) {
        existItem.qty += 1;
      } else {
        state.push(action.payload);
      }
    },
    RemoveItem: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    },
    IncrementQty: (state, action) => {
      let existItem = state.find((item) => item.id === action.payload.id);
      if (existItem) {
        existItem.qty += 1;
      }
    },
    DecrementQty: (state, action) => {
      const existItem = state.find((item) => item.id === action.payload.id);
      if (existItem) {
        if (existItem.qty > 1) {
          return state.map(item =>
            item.id === action.payload.id ? { ...item, qty: item.qty - 1 } : item
          );
        } else {
          // Remove item if qty is 1 and user decrements
          return state.filter(item => item.id !== action.payload.id);
        }
      }
      return state;
    },
    clearCart: (state) => {
      return [];
    }
  }
});

export const { Additem, RemoveItem, IncrementQty, DecrementQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
