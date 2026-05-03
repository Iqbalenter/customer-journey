import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, api } from '../lib/store';
import { Button, Input, Card } from '../components/ui';
import { Coffee } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 text-white">
            <Coffee size={32} />
          </div>
          <h1 className="text-2xl font-bold text-dark">Aroma Coffee Bland</h1>
          <p className="text-gray-500">Customer Journey Mapping System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="p-3 bg-danger/10 text-danger text-sm rounded-md">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@aroma.com"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter password"
              required 
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Login'}
          </Button>
        </form>
        
        <div className="mt-6 text-sm text-center text-gray-500">
           <p>Demo accounts:</p>
           <p>Admin: admin@aroma.com / password</p>
           <p>Operator: operator@aroma.com / password</p>
        </div>
      </Card>
    </div>
  );
}
