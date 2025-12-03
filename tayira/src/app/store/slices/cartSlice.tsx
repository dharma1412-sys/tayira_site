"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = {
  ID: number;
  Product_Name: string;
  Product_ID: number;
  Product_Image?: string;
  link?: string;
  Old_Price?: number;
  Final_Price: number;
  Size?: string;
  Color?: string;
  Quantity: number;
  Session_ID: string;
};

type CartState = {
  items: CartItem[];
  cartSliderOpen?: boolean;
};

const initialState: CartState = {
  items: [],
  cartSliderOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    setCartSliderOpen(state) {
      state.cartSliderOpen = true;
    },
    setCartSliderClose(state) {
      state.cartSliderOpen = false;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find((i) => i.ID === item.ID);
      if (existing) {
        existing.Quantity = Math.max(1, existing.Quantity + item.Quantity);
      } else {
        state.items.push(item);
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.ID !== action.payload);
    },
    updateQty(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const it = state.items.find((i) => i.ID === action.payload.id);
      if (it) it.Quantity = Math.max(1, action.payload.quantity);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { setCart, addItem, removeItem, updateQty, clearCart, setCartSliderOpen, setCartSliderClose } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;