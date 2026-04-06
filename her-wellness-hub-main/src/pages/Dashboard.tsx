import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Droplets, Moon, Footprints, Plus, TrendingUp, Heart } from 'lucide-react';
import { api } from '@/lib/mock-api';
import { HealthData } from '@/lib/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

const getCategory = (score: number) => {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
  if (score >= 60) return { label: 'Good', color: 'text-blue-600' };
  if (score >= 40) return { label: 'Average', color: 'text-yellow-600' };
  return { label: 'Poor', color: 'text-red-600' };
};

const suggestions = [
  'Drink at least 8 glasses of water today 💧',
  'Walk 8,000 steps for better heart health 🚶‍♀️',
  'Get 7-8 hours of quality sleep tonight 🌙',
  'Eat iron-rich foods like spinach and lentils 🥬',
  'Practice 15 minutes of yoga or stretching 🧘‍♀️',
  'Take a 5-minute breathing break to reduce stress 🌸',
];

const Dashboard = () => {
  const [data, setData] = useState<HealthData[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ sleepHours: 7, stepsWalked: 5000, waterIntake: 6, stressLevel: 5, dietQuality: 6, date: format(new Date(), 'yyyy-MM-dd') });

  useEffect(() => { api.getHealthData().then(setData); }, []);

  const today = data[data.length - 1];
  const cat = today ? getCategory(today.healthScore) : null;

  const handleAdd = async () => {
    try {
      await api.addHealthData(form);
      const updated = await api.getHealthData();
      setData(updated);
      setOpen(false);
      toast.success('Health data recorded!');
    } catch { toast.error('Failed to save'); }
  };

  const chartData = data.map(d => ({
    date: format(new Date(d.date), 'EEE'),
    score: d.healthScore,
    sleep: d.sleepHours,
    water: d.waterIntake,
    steps: Math.round(d.stepsWalked / 1000),
  }));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your daily wellness</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-pink text-primary-foreground border-0 rounded-full gap-2">
                <Plus className="w-4 h-4" /> Log Today
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Log Health Data</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Sleep Hours: {form.sleepHours}h</Label>
                  <Slider value={[form.sleepHours]} onValueChange={v => setForm({ ...form, sleepHours: v[0] })} min={0} max={12} step={0.5} />
                </div>
                <div className="space-y-2">
                  <Label>Steps Walked: {form.stepsWalked.toLocaleString()}</Label>
                  <Slider value={[form.stepsWalked]} onValueChange={v => setForm({ ...form, stepsWalked: v[0] })} min={0} max={20000} step={500} />
                </div>
                <div className="space-y-2">
                  <Label>Water Intake: {form.waterIntake} glasses</Label>
                  <Slider value={[form.waterIntake]} onValueChange={v => setForm({ ...form, waterIntake: v[0] })} min={0} max={15} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Stress Level: {form.stressLevel}/10</Label>
                  <Slider value={[form.stressLevel]} onValueChange={v => setForm({ ...form, stressLevel: v[0] })} min={1} max={10} />
                </div>
                <div className="space-y-2">
                  <Label>Diet Quality: {form.dietQuality}/10</Label>
                  <Slider value={[form.dietQuality]} onValueChange={v => setForm({ ...form, dietQuality: v[0] })} min={1} max={10} />
                </div>
                <Button onClick={handleAdd} className="w-full gradient-pink text-primary-foreground border-0 rounded-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Health Score</p>
                <p className={`text-xl font-bold ${cat?.color || ''}`}>{today?.healthScore ?? '--'}</p>
                <p className={`text-xs font-medium ${cat?.color || ''}`}>{cat?.label || '--'}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sleep</p>
                <p className="text-xl font-bold text-foreground">{today?.sleepHours ?? '--'}h</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Water</p>
                <p className="text-xl font-bold text-foreground">{today?.waterIntake ?? '--'} glasses</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Footprints className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Steps</p>
                <p className="text-xl font-bold text-foreground">{today?.stepsWalked?.toLocaleString() ?? '--'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Weekly Health Score</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Moon className="w-5 h-5 text-primary" />Sleep & Water Trends</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sleep" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} name="Sleep (h)" />
                  <Line type="monotone" dataKey="water" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ fill: 'hsl(217, 91%, 60%)' }} name="Water" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions */}
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Heart className="w-5 h-5 text-primary" />Daily Recommendations</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestions.map(s => (
                <div key={s} className="p-3 rounded-xl bg-accent/50 border border-border/50 text-sm text-foreground">{s}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
