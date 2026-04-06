import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MEDICAL_CONDITIONS } from '@/lib/types';
import { toast } from 'sonner';

const HealthProfile = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', age: '', height: '', weight: '',
    allergies: '', lastPeriodDate: '', cycleLength: '28',
  });
  const [conditions, setConditions] = useState<string[]>([]);

  const toggleCondition = (c: string) => {
    setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: form.name,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        allergies: form.allergies,
        lastPeriodDate: form.lastPeriodDate,
        cycleLength: Number(form.cycleLength),
        medicalConditions: conditions,
        profileComplete: true,
      });
      toast.success('Profile completed!');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" fill="white" />
          </div>
          <span className="text-xl font-bold text-foreground">Her Wellness</span>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Health Profile</CardTitle>
            <CardDescription>Help us personalize your health insights</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" placeholder="25" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required min={10} max={100} />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input type="number" placeholder="165" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" placeholder="60" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allergies</Label>
                <Input placeholder="e.g., Peanuts, Shellfish, None" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Last Period Date</Label>
                  <Input type="date" value={form.lastPeriodDate} onChange={e => setForm({ ...form, lastPeriodDate: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Cycle Length (days)</Label>
                  <Input type="number" placeholder="28" value={form.cycleLength} onChange={e => setForm({ ...form, cycleLength: e.target.value })} required min={21} max={40} />
                </div>
              </div>

              {/* Medical Conditions */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Medical Conditions</Label>
                <p className="text-sm text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto rounded-xl border border-border p-4">
                  {MEDICAL_CONDITIONS.map(c => (
                    <label key={c} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                      <Checkbox checked={conditions.includes(c)} onCheckedChange={() => toggleCondition(c)} />
                      <span className="text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full gradient-pink text-primary-foreground border-0 h-11 rounded-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthProfile;
