import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  loading: false,
  error: null,
  lastSaved: null,
};

const transactionSlice = createSlice({
  name: 'transactions',

  initialState,

  reducers: {
    addTransaction: (state, action) => {
      const transaction = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'PENDING',
      };

      state.transactions.unshift(transaction);
      state.lastSaved = transaction.id;
      state.error = null;
    },

    removeTransaction: (state, action) => {
      const id = action.payload;

      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== id,
      );
    },

    updateTransactionStatus: (state, action) => {
      const { id, status } = action.payload;

      const transaction = state.transactions.find(
        (transaction) => transaction.id === id,
      );

      if (transaction) {
        transaction.status = status;
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addTransaction,
  removeTransaction,
  updateTransactionStatus,
  setLoading,
  setError,
} = transactionSlice.actions;

export const selectAllTransactions = (state) =>
  state.transactions.transactions;

export const selectTransactionCount = (state) =>
  state.transactions.transactions.length;

export const selectTotalDeposits = (state) =>
  state.transactions.transactions
    .filter((transaction) => transaction.accountType === 'DEPOSIT')
    .reduce(
      (sum, transaction) =>
        sum + Number.parseFloat(transaction.amount || 0),
      0,
    );

export const selectTotalWithdrawals = (state) =>
  state.transactions.transactions
    .filter((transaction) => transaction.accountType === 'WITHDRAW')
    .reduce(
      (sum, transaction) =>
        sum + Number.parseFloat(transaction.amount || 0),
      0,
    );

export const selectNetBalance = (state) =>
  selectTotalDeposits(state) - selectTotalWithdrawals(state);

export default transactionSlice.reducer;