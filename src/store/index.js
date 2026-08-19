import { configureStore } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';

import transactionReducer from './slices/transactionSlice';

const storage = {
    getItem: async (key) => {
        return localStorage.getItem(key);
    },

    setItem: async (key, value) => {
        localStorage.setItem(key, value);
    },

    removeItem: async (key) => {
        localStorage.removeItem(key);
    },
};

const persistConfig = {
    key: 'transactions',
    storage,
};

const persistedTransactionReducer = persistReducer(
    persistConfig,
    transactionReducer,
);

export const store = configureStore({
    reducer: {
        transactionReducer: persistedTransactionReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);