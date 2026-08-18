import { useDispatch, useSelector } from 'react-redux';

import {
  addTransaction,
  removeTransaction,
  updateTransactionStatus,
} from '../store/slices/transactionSlice';

const Transactions = () => {
  const dispatch = useDispatch();

  const {
    transactions,
    loading,
    error,
  } = useSelector((state:any) => state.transactions);

  const handleAdd = () => {
    dispatch(
      addTransaction({
        accountNumber: '1234567890',
        amount: 1500,
        type: 'CREDIT',
        description: 'Salary',
      }),
    );
  };

  const handleApprove = (id) => {
    dispatch(
      updateTransactionStatus({
        id,
        status: 'APPROVED',
      }),
    );
  };

  return (
    <div>
      <button onClick={handleAdd}>
        Add Transaction
      </button>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <span>{transaction.description}</span>
          <span>{transaction.amount}</span>
          <span>{transaction.status}</span>

          <button
            onClick={() => handleApprove(transaction.id)}
          >
            Approve
          </button>

          <button
            onClick={() =>
              dispatch(removeTransaction(transaction.id))
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default Transactions;