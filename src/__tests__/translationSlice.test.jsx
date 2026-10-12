import reducer, {
    addTransaction,
    removeTransaction,
    updateTransactionStatus,
} from '../store/slices/transactionSlice';

describe('transactionSlice reducers', () => {
    test('returns the expected initial transaction state', () => {
        const state = reducer(undefined, {
            type: '@@INIT',
        });

        expect(state.transactions).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.lastSaved).toBeNull();
    });

    test('adds a transaction with generated id, createdAt, and PENDING status', () => {
        const state = reducer(
            undefined,
            addTransaction({
                name: 'Alice',
                amount: 500,
            }),
        );

        expect(state.transactions).toHaveLength(1);
        expect(state.transactions[0].name).toBe('Alice');
        expect(state.transactions[0].amount).toBe(500);
        expect(state.transactions[0].id).toBeDefined();
        expect(state.transactions[0].createdAt).toBeDefined();
        expect(state.transactions[0].status).toBe('PENDING');
        expect(state.lastSaved).toBe(state.transactions[0].id);
    });

    test('removes an existing transaction when its id is provided', () => {
        let state = reducer(
            undefined,
            addTransaction({
                id: 'tx-1',
                name: 'Bob',
                amount: 250,
            }),
        );

        state = reducer(
            state,
            removeTransaction('tx-1'),
        );

        expect(state.transactions).toHaveLength(0);
    });

    test('keeps transactions unchanged when removing an unknown id', () => {
        let state = reducer(
            undefined,
            addTransaction({
                id: 'tx-1',
                name: 'Alice',
                amount: 500,
            }),
        );

        state = reducer(
            state,
            removeTransaction('unknown-id'),
        );

        expect(state.transactions).toHaveLength(1);
        expect(state.transactions[0].id).toBe('tx-1');
        expect(state.transactions[0].name).toBe('Alice');
    });

    test('updates the status of only the matching transaction', () => {
        let state = reducer(
            undefined,
            addTransaction({
                id: 'tx-1',
                name: 'Alice',
                amount: 500,
            }),
        );

        state = reducer(
            state,
            addTransaction({
                id: 'tx-2',
                name: 'Bob',
                amount: 300,
            }),
        );

        state = reducer(
            state,
            updateTransactionStatus({
                id: 'tx-1',
                status: 'SUCCESS',
            }),
        );

        const updated = state.transactions.find(
            (transaction) => transaction.id === 'tx-1',
        );

        const unchanged = state.transactions.find(
            (transaction) => transaction.id === 'tx-2',
        );

        expect(updated.status).toBe('SUCCESS');
        expect(unchanged.status).toBe('PENDING');
    });
});