import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
};

interface AppState {
  users: any[];
  customers: any[];
  products: any[];
  transactions: any[];
  transaction_details: any[];
  feedbacks: any[];

  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;

  addCustomer: (customer: any) => void;
  updateCustomer: (id: string, customer: any) => void;
  deleteCustomer: (id: string) => void;
  
  addProduct: (product: any) => void;
  updateProduct: (id: string, product: any) => void;
  deleteProduct: (id: string) => void;

  addTransaction: (transaction: any, details: any[]) => void;
  updateTransaction: (id: string, transaction: any) => void;
  deleteTransaction: (id: string) => void;

  addFeedback: (feedback: any) => void;
  updateFeedback: (id: string, feedback: any) => void;
  deleteFeedback: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      users: [
        { id: '1', name: 'Admin', email: 'admin@aroma.com', password: 'password', role: 'admin' },
        { id: '2', name: 'Operator', email: 'operator@aroma.com', password: 'password', role: 'operator' }
      ],
      customers: [
        { id: 'c1', customer_name: 'Budi Santoso', phone: '081234567890', email: 'budi@test.com', address: 'Medan', first_purchase_date: '2023-01-10T00:00:00.000Z', customer_status: 'Loyal', notes: '' },
        { id: 'c2', customer_name: 'Siti Aminah', phone: '081987654321', email: 'siti@test.com', address: 'Medan', first_purchase_date: '2024-02-15T00:00:00.000Z', customer_status: 'Aktif', notes: '' },
      ],
      products: [
        { id: 'p1', product_name: 'Caramel Macchiato', category: 'Coffee', price: 25000, description: 'Kopi dengan caramel', is_active: true },
        { id: 'p2', product_name: 'Hazelnut Latte', category: 'Coffee', price: 23000, description: 'Latte dengan hazelnut', is_active: true },
      ],
      transactions: [],
      transaction_details: [],
      feedbacks: [],

      user: null,
      token: null,

      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      
      addCustomer: (customer) => set(state => ({ customers: [...state.customers, { id: `c${Date.now()}`, customer_status: 'Baru', first_purchase_date: new Date().toISOString(), ...customer }] })),
      updateCustomer: (id, customer) => set(state => ({ customers: state.customers.map(c => c.id === id ? { ...c, ...customer } : c) })),
      deleteCustomer: (id) => set(state => ({ customers: state.customers.filter(c => c.id !== id) })),

      addProduct: (product) => set(state => ({ products: [...state.products, { id: `p${Date.now()}`, ...product }] })),
      updateProduct: (id, product) => set(state => ({ products: state.products.map(p => p.id === id ? { ...p, ...product } : p) })),
      deleteProduct: (id) => set(state => ({ products: state.products.filter(p => p.id !== id) })),

      addTransaction: (transaction, details) => set(state => {
        const tId = `tx${Date.now()}`;
        const tDetails = details?.map((d: any) => ({
            id: `td${Date.now()}${Math.random()}`,
            transaction_id: tId,
            ...d
        })) || [];
        
        const updatedCustomers = state.customers.map(c => {
             if (c.id === transaction.customer_id && (!c.first_purchase_date || isNaN(new Date(c.first_purchase_date).getTime()))) {
                 return { ...c, first_purchase_date: transaction.transaction_date };
             }
             return c;
        });

        return { 
           transactions: [...state.transactions, { id: tId, ...transaction }],
           transaction_details: [...state.transaction_details, ...tDetails],
           customers: updatedCustomers
        };
      }),
      updateTransaction: (id, transaction) => set(state => ({ transactions: state.transactions.map(t => t.id === id ? { ...t, ...transaction } : t) })),
      deleteTransaction: (id) => set(state => ({ 
          transactions: state.transactions.filter(t => t.id !== id),
          transaction_details: state.transaction_details.filter(td => td.transaction_id !== id)
      })),

      addFeedback: (feedback) => set(state => ({ feedbacks: [...state.feedbacks, { id: `f${Date.now()}`, is_pain_point: feedback.rating <= 2, ...feedback }] })),
      updateFeedback: (id, feedback) => set(state => ({ feedbacks: state.feedbacks.map(f => f.id === id ? { ...f, ...feedback, is_pain_point: feedback.rating <= 2 } : f) })),
      deleteFeedback: (id) => set(state => ({ feedbacks: state.feedbacks.filter(f => f.id !== id) })),
    }),
    {
      name: 'aroma-coffee-storage',
    }
  )
);

export const useAuthStore = useAppStore;

