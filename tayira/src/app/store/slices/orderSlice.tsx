"use client";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type OrderPayload = {
  Order_ID: string;
  Customer_ID?: number | null;
  Total_Amount: number;
  Discount_Amount?: number;
  Final_Amount: number;
  Payment_Method?: string;
  Transaction_ID?: string;
  Delivery_Address?: string;
  Billing_Address?: string;
  Notes?: string;
  items?: any[];
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (payload: OrderPayload) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Order creation failed');
    }
    return res.json();
  }
);

type OrderState = {
  loading: boolean;
  error?: string | null;
  lastOrder?: any;
};

const initialState: OrderState = {
  loading: false,
  error: null,
  lastOrder: null,
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearLastOrder(state) {
      state.lastOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed';
      });
  },
});

export const { clearLastOrder } = slice.actions;
export const orderReducer = slice.reducer;