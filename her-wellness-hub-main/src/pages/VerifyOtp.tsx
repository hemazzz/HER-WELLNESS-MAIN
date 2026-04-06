import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();
  const email = (location.state as any)?.email || localStorage.getItem('pending_email') || '';

  const handleVerify = async () => {
  if (otp.length < 6) {
    toast.error('Please enter complete OTP');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error(data.message || "Invalid OTP");
    }

    toast.success('OTP Verified ✅');

    navigate('/login');

  } catch (err: any) {
    console.log(err);
    toast.error(err.message || 'Invalid OTP ❌');
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
          </Link>
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <CardDescription>Enter the 6-digit code sent to {email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map(i => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={handleVerify}className="w-full gradient-pink text-primary-foreground border-0 h-11 rounded-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
          </Button>
          <button className="text-sm text-primary hover:underline">Resend OTP</button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
