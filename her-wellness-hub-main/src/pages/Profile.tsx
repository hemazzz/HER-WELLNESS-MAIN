import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Save, Loader2, Edit3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MEDICAL_CONDITIONS } from '@/lib/types';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', age: 0, height: 0, weight: 0,
    allergies: '', lastPeriodDate: '', cycleLength: 28,
  });
  const [conditions, setConditions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name, age: user.age, height: user.height,
        weight: user.weight, allergies: user.allergies,
        lastPeriodDate: user.lastPeriodDate, cycleLength: user.cycleLength,
      });
      setConditions(user.medicalConditions);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ ...form, medicalConditions: conditions });
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <User className="w-8 h-8 text-primary" /> Profile
          </h1>
          <div className="flex gap-2">
            {!editing && (
              <Button variant="outline" onClick={() => setEditing(true)} className="rounded-full gap-2">
                <Edit3 className="w-4 h-4" /> Edit
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="rounded-full gap-2 text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" value={form.age} onChange={e => setForm({ ...form, age: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" value={form.height} onChange={e => setForm({ ...form, height: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Input value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Last Period Date</Label>
                    <Input type="date" value={form.lastPeriodDate} onChange={e => setForm({ ...form, lastPeriodDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cycle Length (days)</Label>
                    <Input type="number" value={form.cycleLength} onChange={e => setForm({ ...form, cycleLength: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border rounded-xl p-3">
                    {MEDICAL_CONDITIONS.map(c => (
                      <label key={c} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent cursor-pointer text-sm">
                        <Checkbox checked={conditions.includes(c)} onCheckedChange={() => setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="gradient-pink text-primary-foreground border-0 rounded-full gap-2" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)} className="rounded-full">Cancel</Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {[
                  { label: 'Name', value: user.name || 'Not set' },
                  { label: 'Email', value: user.email },
                  { label: 'Age', value: user.age ? `${user.age} years` : 'Not set' },
                  { label: 'Height', value: user.height ? `${user.height} cm` : 'Not set' },
                  { label: 'Weight', value: user.weight ? `${user.weight} kg` : 'Not set' },
                  { label: 'Allergies', value: user.allergies || 'None' },
                  { label: 'Last Period', value: user.lastPeriodDate || 'Not set' },
                  { label: 'Cycle Length', value: user.cycleLength ? `${user.cycleLength} days` : 'Not set' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
                <div>
                  <span className="text-sm text-muted-foreground block mb-2">Medical Conditions</span>
                  <div className="flex flex-wrap gap-2">
                    {user.medicalConditions.length > 0
                      ? user.medicalConditions.map(c => <Badge key={c} variant="secondary" className="rounded-full">{c}</Badge>)
                      : <span className="text-sm text-muted-foreground">None selected</span>}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
