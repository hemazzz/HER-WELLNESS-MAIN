import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarHeart, Droplets, Heart, Sun } from 'lucide-react';
import { api } from '@/lib/mock-api';
import { addDays, format, isWithinInterval, parseISO, differenceInDays } from 'date-fns';

const PeriodTracker = () => {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  useEffect(() => {
    api.getPeriodData().then(d => {
      setLastPeriod(d.lastPeriodDate);
      setCycleLength(d.cycleLength);
    });
  }, []);

  const lastDate = lastPeriod ? parseISO(lastPeriod) : new Date();
  const nextPeriod = addDays(lastDate, cycleLength);
  const ovulationDay = addDays(lastDate, cycleLength - 14);
  const ovulationStart = addDays(ovulationDay, -2);
  const ovulationEnd = addDays(ovulationDay, 2);
  const daysUntil = differenceInDays(nextPeriod, new Date());

  const periodDays = Array.from({ length: 5 }, (_, i) => addDays(lastDate, i));
  const nextPeriodDays = Array.from({ length: 5 }, (_, i) => addDays(nextPeriod, i));
  const ovulationDays: Date[] = [];
  let d = ovulationStart;
  while (d <= ovulationEnd) { ovulationDays.push(d); d = addDays(d, 1); }

  const modifiers = {
    period: [...periodDays, ...nextPeriodDays],
    ovulation: ovulationDays,
  };

  const modifiersStyles = {
    period: { backgroundColor: 'hsl(340, 82%, 52%)', color: 'white', borderRadius: '50%' },
    ovulation: { backgroundColor: 'hsl(38, 92%, 50%)', color: 'white', borderRadius: '50%' },
  };

  const getCurrentPhase = () => {
    const today = new Date();
    if (periodDays.some(d => format(d, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) || nextPeriodDays.some(d => format(d, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')))
      return 'Menstrual Phase';
    if (isWithinInterval(today, { start: ovulationStart, end: ovulationEnd }))
      return 'Ovulation Window';
    if (differenceInDays(today, lastDate) < 13) return 'Follicular Phase';
    return 'Luteal Phase';
  };

  const phaseTips: Record<string, string[]> = {
    'Menstrual Phase': ['Rest and hydrate well', 'Eat iron-rich foods', 'Light yoga or stretching', 'Use heat pads for cramps'],
    'Follicular Phase': ['Great time for intense workouts', 'Increase protein intake', 'Focus on creative tasks', 'Energy levels are rising!'],
    'Ovulation Window': ['Peak energy — high-intensity exercise', 'Stay hydrated', 'Fertile window — plan accordingly', 'Social activities boost mood'],
    'Luteal Phase': ['Cravings may increase — eat balanced meals', 'Prioritize rest', 'Magnesium-rich foods help with PMS', 'Practice stress management'],
  };

  const phase = getCurrentPhase();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarHeart className="w-8 h-8 text-primary" /> Period Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Track and predict your menstrual cycle</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Droplets className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Next Period</p>
              <p className="font-bold text-foreground">{format(nextPeriod, 'MMM d')}</p>
              <Badge variant="secondary" className="mt-1 rounded-full text-xs">{daysUntil > 0 ? `${daysUntil} days` : 'Today'}</Badge>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Ovulation</p>
              <p className="font-bold text-foreground">{format(ovulationDay, 'MMM d')}</p>
              <Badge variant="secondary" className="mt-1 rounded-full text-xs">{format(ovulationStart, 'MMM d')} - {format(ovulationEnd, 'MMM d')}</Badge>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Cycle Length</p>
              <p className="font-bold text-foreground">{cycleLength} days</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <CalendarHeart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Current Phase</p>
              <p className="font-bold text-foreground text-sm">{phase}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={setSelected}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
              />
            </CardContent>
            <div className="px-6 pb-4 flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" /> Period</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500" /> Ovulation</span>
            </div>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Phase Tips: {phase}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {phaseTips[phase]?.map(tip => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PeriodTracker;
