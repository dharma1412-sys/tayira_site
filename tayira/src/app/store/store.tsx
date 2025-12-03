"use client";
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { cartReducer } from './slices/cartSlice';
import { orderReducer } from './slices/orderSlice';

const LOCAL_KEY = 'tayira_redux_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function saveState(state: any) {
  try {
    const toSave = { cart: state.cart }; // persist only cart (keep small)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(toSave));
  } catch {}
}

const rootReducer = combineReducers({
  cart: cartReducer,
  order: orderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: typeof window !== 'undefined' ? loadState() : undefined,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;