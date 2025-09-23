import { createSlice } from "@reduxjs/toolkit";

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
      let existItem = state.find((item) => item.id === action.payload.id);
      if (existItem) {
        if (existItem.qty > 1) {
          existItem.qty -= 1;
        } else {
          // Remove item if qty is 1 and user decrements
          return state.filter(item => item.id !== action.payload.id);
        }
      }
    }
  }
});

export const { Additem, RemoveItem, IncrementQty, DecrementQty } = cartSlice.actions;
export default cartSlice.reducer;