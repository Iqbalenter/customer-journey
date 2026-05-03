import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes (MOCKING LARAVEL BACKEND) ---
  
  // Data Store
  const db = {
    users: [
      { id: '1', name: 'Admin', email: 'admin@aroma.com', password: 'password', role: 'admin' },
      { id: '2', name: 'Operator', email: 'operator@aroma.com', password: 'password', role: 'operator' }
    ],
    customers: [
      { id: 'c1', customer_name: 'Budi Santoso', phone: '081234567890', email: 'budi@test.com', address: 'Medan', first_purchase_date: '2023-01-10', customer_status: 'Loyal', notes: '' },
      { id: 'c2', customer_name: 'Siti Aminah', phone: '081987654321', email: 'siti@test.com', address: 'Medan', first_purchase_date: '2024-02-15', customer_status: 'Aktif', notes: '' },
    ],
    products: [
      { id: 'p1', product_name: 'Caramel Macchiato', category: 'Coffee', price: 25000, description: 'Kopi dengan caramel', is_active: true },
      { id: 'p2', product_name: 'Hazelnut Latte', category: 'Coffee', price: 23000, description: 'Latte dengan hazelnut', is_active: true },
    ],
    transactions: [],
    transaction_details: [],
    feedbacks: [],
  };

  // Auth Middleware Mock
  const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthenticated.' });
    
    // In a real app we'd decode token. Here we just use the token as email for simplicity
    const user = db.users.find(u => u.email === token);
    if (!user) return res.status(401).json({ message: 'Invalid token.' });
    
    req.user = user;
    next();
  };

  const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden.' });
    next();
  };

  // Auth Routes
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      // Mocking Sanctum token returning email as token
      res.json({ user, token: user.email });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  app.get('/api/user', authMiddleware, (req, res) => {
    res.json(req.user);
  });

  // Feature Routes (Customers)
  app.get('/api/customers', authMiddleware, (req, res) => {
    // Menghitung Loyalty Score untuk setiap pelanggan secara dinamis
    const updatedCustomers = db.customers.map(customer => {
        const custTx = db.transactions.filter(t => t.customer_id === customer.id);
        const custFb = db.feedbacks.filter(f => f.customer_id === customer.id);
        
        const total_transactions = custTx.length;
        const avg_rating = custFb.length > 0 ? custFb.reduce((a, b) => a + b.rating, 0) / custFb.length : 0;
        
        // Kalkulasi:
        // skor transaksi berulang: 100 jika > 10 kali
        const repeat_purchase_score = Math.min(total_transactions * 10, 100); 
        // rata-rata rating (skala 1-5): convert ke 0-100 (5 -> 100)
        const rating_score = (avg_rating / 5) * 100;
        // aktivitas feedback: 100 jika pernah feedback > 3 kali
        const feedback_score = Math.min(custFb.length * 33, 100);

        // Loyalty Score = (40% * skor transaksi berulang) + (40% * rata-rata rating) + (20% * aktivitas feedback)
        const loyalty_score = (0.4 * repeat_purchase_score) + (0.4 * rating_score) + (0.2 * feedback_score);

        let status = 'Baru';
        if (loyalty_score > 70) status = 'Loyal';
        else if (loyalty_score > 40) status = 'Potensial Loyal';
        else if (total_transactions > 0) status = 'Aktif';

        return {
            ...customer,
            loyalty_score: loyalty_score.toFixed(1),
            customer_status: status
        };
    });
    res.json(updatedCustomers);
  });
  app.post('/api/customers', authMiddleware, (req, res) => {
    const newCustomer = { id: `c${Date.now()}`, ...req.body, first_purchase_date: new Date().toISOString() };
    db.customers.push(newCustomer);
    res.json(newCustomer);
  });
  app.put('/api/customers/:id', authMiddleware, (req, res) => {
    const idx = db.customers.findIndex(c => c.id === req.params.id);
    if (idx > -1) {
      db.customers[idx] = { ...db.customers[idx], ...req.body };
      res.json(db.customers[idx]);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  });

  app.delete('/api/customers/:id', authMiddleware, (req, res) => {
    db.customers = db.customers.filter(c => c.id !== req.params.id);
    res.json({ success: true });
  });

  // Products
  app.get('/api/products', authMiddleware, (req, res) => res.json(db.products));
  app.post('/api/products', authMiddleware, adminMiddleware, (req, res) => {
    const newProduct = { id: `p${Date.now()}`, ...req.body };
    db.products.push(newProduct);
    res.json(newProduct);
  });
  app.put('/api/products/:id', authMiddleware, adminMiddleware, (req, res) => {
    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx > -1) {
      db.products[idx] = { ...db.products[idx], ...req.body };
      res.json(db.products[idx]);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  });
  app.delete('/api/products/:id', authMiddleware, adminMiddleware, (req, res) => {
    db.products = db.products.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // Transactions
  app.get('/api/transactions', authMiddleware, (req, res) => {
    res.json(db.transactions);
  });
  app.post('/api/transactions', authMiddleware, (req, res) => {
    const transactionId = `t${Date.now()}`;
    const transaction = { 
        id: transactionId, 
        customer_id: req.body.customer_id, 
        transaction_date: new Date().toISOString(),
        total_amount: req.body.total_amount,
        payment_method: req.body.payment_method,
        notes: req.body.notes
    };
    db.transactions.push(transaction);
    req.body.details?.forEach(detail => {
        db.transaction_details.push({
            id: `td${Date.now()}${Math.random()}`,
            transaction_id: transactionId,
            ...detail
        });
    });
    
    // Update Customer Status if applicable
    const customer = db.customers.find(c => c.id === req.body.customer_id);
    if (customer) {
        const custTx = db.transactions.filter(t => t.customer_id === customer.id);
        if (custTx.length > 1 && customer.customer_status === 'Baru') {
            customer.customer_status = 'Aktif';
        }
    }

    res.json(transaction);
  });
  app.put('/api/transactions/:id', authMiddleware, adminMiddleware, (req, res) => {
    const idx = db.transactions.findIndex(t => t.id === req.params.id);
    if (idx > -1) {
      db.transactions[idx] = { ...db.transactions[idx], ...req.body };
      res.json(db.transactions[idx]);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  });
  app.delete('/api/transactions/:id', authMiddleware, adminMiddleware, (req, res) => {
    db.transactions = db.transactions.filter(t => t.id !== req.params.id);
    res.json({ success: true });
  });

  // Feedback
  app.get('/api/feedbacks', authMiddleware, (req, res) => res.json(db.feedbacks));
  app.post('/api/feedbacks', authMiddleware, (req, res) => {
    const newFeedback = { 
        id: `f${Date.now()}`, 
        ...req.body, 
        is_pain_point: req.body.rating <= 2,
        created_at: new Date().toISOString()
    };
    db.feedbacks.push(newFeedback);
    res.json(newFeedback);
  });
  app.put('/api/feedbacks/:id', authMiddleware, adminMiddleware, (req, res) => {
    const idx = db.feedbacks.findIndex(f => f.id === req.params.id);
    if (idx > -1) {
      db.feedbacks[idx] = { ...db.feedbacks[idx], ...req.body, is_pain_point: req.body.rating <= 2 };
      res.json(db.feedbacks[idx]);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  });
  app.delete('/api/feedbacks/:id', authMiddleware, adminMiddleware, (req, res) => {
    db.feedbacks = db.feedbacks.filter(f => f.id !== req.params.id);
    res.json({ success: true });
  });

  // Dashboard Stats
  app.get('/api/dashboard', authMiddleware, (req, res) => {
    let sumLoyalty = 0;
    
    // Calculate loyalty dynamically
    db.customers.forEach(customer => {
        const custTx = db.transactions.filter(t => t.customer_id === customer.id);
        const custFb = db.feedbacks.filter(f => f.customer_id === customer.id);
        
        const total_transactions = custTx.length;
        const avg_rating = custFb.length > 0 ? custFb.reduce((a, b) => a + b.rating, 0) / custFb.length : 0;
        
        const repeat_purchase_score = Math.min(total_transactions * 10, 100); 
        const rating_score = (avg_rating / 5) * 100;
        const feedback_score = Math.min(custFb.length * 33, 100);

        const loyalty_score = (0.4 * repeat_purchase_score) + (0.4 * rating_score) + (0.2 * feedback_score);
        sumLoyalty += loyalty_score;
    });

    res.json({
      total_customers: db.customers.length,
      total_transactions: db.transactions.length,
      total_feedbacks: db.feedbacks.length,
      avg_rating: db.feedbacks.length > 0 ? (db.feedbacks.reduce((a, b) => a + b.rating, 0) / db.feedbacks.length).toFixed(1) : 0,
      loyalty_score: db.customers.length > 0 ? (sumLoyalty / db.customers.length).toFixed(1) : 0
    });
  });


  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist'); // Now works because dist is next to server.cjs
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
