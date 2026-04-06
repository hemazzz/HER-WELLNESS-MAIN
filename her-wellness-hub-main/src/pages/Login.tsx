import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" fill="white" />
            </div>
            <span className="text-xl font-bold text-foreground">Her Wellness</span>
          </Link>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline block text-right">Forgot password?</Link>
            <Button type="submit" className="w-full gradient-pink text-primary-foreground border-0 h-11 rounded-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
