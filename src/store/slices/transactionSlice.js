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
                id: action.payload.id ?? Date.now(),
                createdAt:
                    action.payload.createdAt ??
                    new Date().toISOString(),
                status: action.payload.status ?? 'PENDING',
            };

            return {
                ...state,
                transactions: [
                    transaction,
                    ...state.transactions,
                ],
                lastSaved: transaction.id,
                error: null,
            };
        },

        removeTransaction: (state, action) => {
            const id = action.payload;

            return {
                ...state,
                transactions: state.transactions.filter(
                    (transaction) => transaction.id !== id,
                ),
            };
        },

        updateTransactionStatus: (state, action) => {
            const { id, status } = action.payload;

            return {
                ...state,
                transactions: state.transactions.map(
                    (transaction) =>
                        transaction.id === id
                            ? { ...transaction, status }
                            : transaction,
                ),
            };
        },

        setLoading: (state, action) => {
            return {
                ...state,
                loading: action.payload,
            };
        },

        setError: (state, action) => {
            return {
                ...state,
                error: action.payload,
            };
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
    state.transactionReducer.transactions;

export const selectTransactionCount = (state) =>
    state.transactionReducer.transactions.length;

export const selectTotalDeposits = (state) =>
    state.transactionReducer.transactions
        .filter(
            (transaction) => transaction.accountType === 'DEPOSIT',
        )
        .reduce(
            (sum, transaction) =>
                sum + Number.parseFloat(transaction.amount || 0),
            0,
        );

export const selectTotalWithdrawals = (state) =>
    state.transactionReducer.transactions
        .filter(
            (transaction) => transaction.accountType === 'WITHDRAW',
        )
        .reduce(
            (sum, transaction) =>
                sum + Number.parseFloat(transaction.amount || 0),
            0,
        );

export const selectNetBalance = (state) =>
    selectTotalDeposits(state) - selectTotalWithdrawals(state);

export default transactionSlice.reducer;