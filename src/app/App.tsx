import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home/Home';
import CreateTransaction from '../pages/CreateTransaction/CreateTransaction';
import TransactionList from '../pages/TransactionList/TransactionList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/create-transaction"
          element={<CreateTransaction />}
        />

        <Route
          path="/transactions"
          element={<TransactionList />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;