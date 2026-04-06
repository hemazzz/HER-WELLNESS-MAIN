import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    toast.success('OTP sent to your email! 📩');

    navigate('/verify-otp', { state: { email } });

  } catch (err: any) {
    console.log(err);
    toast.error(err.message || 'Signup failed ❌');
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
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join Her Wellness today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full gradient-pink text-primary-foreground border-0 h-11 rounded-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
