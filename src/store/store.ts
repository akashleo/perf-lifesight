import { configureStore } from '@reduxjs/toolkit';
import marketingReducer from './slices/marketingSlice';

export const store = configureStore({
  reducer: {
    marketing: marketingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
