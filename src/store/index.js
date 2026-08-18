import { configureStore } from '@reduxjs/toolkit';

import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },

  devTools: import.meta.env.DEV,
});

export default store;