/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Transactions from './pages/Transactions';
import TransactionForm from './pages/TransactionForm';
import Feedbacks from './pages/Feedbacks';
import FeedbackForm from './pages/FeedbackForm';
import CJM from './pages/CJM';
import Segmentation from './pages/Segmentation';

import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/new" element={<TransactionForm />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="feedbacks/new" element={<FeedbackForm />} />
          <Route path="cjm" element={<CJM />} />
          <Route path="segmentation" element={<Segmentation />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
