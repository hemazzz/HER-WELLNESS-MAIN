import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

import {
  CalendarHeart,
  Droplets,
  Heart,
  Sun
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

import {
  addDays,
  format,
  isWithinInterval,
  parseISO,
  differenceInDays
} from 'date-fns';

const PeriodTracker = () => {

  const { user } = useAuth();

  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  const [selected, setSelected] =
    useState<Date | undefined>(new Date());

  // ✅ LOAD USER DATA
  useEffect(() => {

    if (user) {

      setLastPeriod(
        user.lastPeriodDate || ''
      );

      setCycleLength(
        user.cycleLength || 28
      );

    }

  }, [user]);

  // ✅ SAFETY
  const lastDate =
    lastPeriod
      ? parseISO(lastPeriod)
      : new Date();

  // ✅ CALCULATIONS
  const nextPeriod =
    addDays(lastDate, cycleLength);

  const ovulationDay =
    addDays(lastDate, cycleLength - 14);

  const ovulationStart =
    addDays(ovulationDay, -2);

  const ovulationEnd =
    addDays(ovulationDay, 2);

  const daysUntil =
    differenceInDays(
      nextPeriod,
      new Date()
    );

  // ✅ PERIOD DAYS
  const periodDays =
    Array.from(
      { length: 5 },
      (_, i) => addDays(lastDate, i)
    );

  const nextPeriodDays =
    Array.from(
      { length: 5 },
      (_, i) => addDays(nextPeriod, i)
    );

  // ✅ OVULATION DAYS
  const ovulationDays: Date[] = [];

  let d = ovulationStart;

  while (d <= ovulationEnd) {

    ovulationDays.push(d);

    d = addDays(d, 1);

  }

  // ✅ CALENDAR MODIFIERS
  const modifiers = {
    period: [
      ...periodDays,
      ...nextPeriodDays
    ],

    ovulation: ovulationDays,
  };

  // ✅ COLORS
  const modifiersStyles = {

    period: {
      backgroundColor: 'hsl(340, 82%, 52%)',
      color: 'white',
      borderRadius: '50%',
    },

    ovulation: {
      backgroundColor: 'hsl(38, 92%, 50%)',
      color: 'white',
      borderRadius: '50%',
    },

  };

  // ✅ CURRENT PHASE
  const getCurrentPhase = () => {

    const today = new Date();

    // Period
    if (

      periodDays.some(
        d =>
          format(d, 'yyyy-MM-dd') ===
          format(today, 'yyyy-MM-dd')
      )

    ) {

      return 'Menstrual Phase';

    }

    // Ovulation
    if (

      isWithinInterval(
        today,
        {
          start: ovulationStart,
          end: ovulationEnd
        }
      )

    ) {

      return 'Ovulation Window';

    }

    // Follicular
    if (
      differenceInDays(
        today,
        lastDate
      ) < 13
    ) {

      return 'Follicular Phase';

    }

    // Luteal
    return 'Luteal Phase';

  };

  const phase = getCurrentPhase();

  // ✅ PHASE TIPS
  const phaseTips: Record<string, string[]> = {

    'Menstrual Phase': [
      'Rest and hydrate well',
      'Eat iron-rich foods',
      'Light yoga or stretching',
      'Use heat pads for cramps',
    ],

    'Follicular Phase': [
      'Great time for workouts',
      'Increase protein intake',
      'Focus on creative tasks',
      'Energy levels are rising!',
    ],

    'Ovulation Window': [
      'Peak energy levels',
      'Stay hydrated',
      'Fertile window',
      'Social activities boost mood',
    ],

    'Luteal Phase': [
      'Cravings may increase',
      'Prioritize rest',
      'Eat magnesium-rich foods',
      'Practice stress management',
    ],

  };

  return (

    <DashboardLayout>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div>

          <h1 className="text-3xl font-bold flex items-center gap-3">

            <CalendarHeart
              className="w-8 h-8 text-pink-500"
            />

            Period Tracker

          </h1>

          <p className="text-gray-500 mt-1">
            Track and predict your menstrual cycle
          </p>

        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* NEXT PERIOD */}
          <Card>

            <CardContent className="p-4 text-center">

              <Droplets
                className="w-6 h-6 text-pink-500 mx-auto mb-2"
              />

              <p className="text-xs text-gray-500">
                Next Period
              </p>

              <p className="font-bold">
                {format(nextPeriod, 'MMM d')}
              </p>

              <Badge className="mt-2 rounded-full">

                {daysUntil > 0
                  ? `${daysUntil} days`
                  : 'Today'}

              </Badge>

            </CardContent>

          </Card>

          {/* OVULATION */}
          <Card>

            <CardContent className="p-4 text-center">

              <Sun
                className="w-6 h-6 text-yellow-500 mx-auto mb-2"
              />

              <p className="text-xs text-gray-500">
                Ovulation
              </p>

              <p className="font-bold">
                {format(ovulationDay, 'MMM d')}
              </p>

              <Badge className="mt-2 rounded-full">

                {format(
                  ovulationStart,
                  'MMM d'
                )}

                {' - '}

                {format(
                  ovulationEnd,
                  'MMM d'
                )}

              </Badge>

            </CardContent>

          </Card>

          {/* CYCLE */}
          <Card>

            <CardContent className="p-4 text-center">

              <Heart
                className="w-6 h-6 text-pink-500 mx-auto mb-2"
              />

              <p className="text-xs text-gray-500">
                Cycle Length
              </p>

              <p className="font-bold">
                {cycleLength} days
              </p>

            </CardContent>

          </Card>

          {/* PHASE */}
          <Card>

            <CardContent className="p-4 text-center">

              <CalendarHeart
                className="w-6 h-6 text-pink-500 mx-auto mb-2"
              />

              <p className="text-xs text-gray-500">
                Current Phase
              </p>

              <p className="font-bold text-sm">
                {phase}
              </p>

            </CardContent>

          </Card>

        </div>

        {/* CALENDAR + TIPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CALENDAR */}
          <Card>

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

              <span className="flex items-center gap-1">

                <span className="w-3 h-3 rounded-full bg-pink-500" />

                Period

              </span>

              <span className="flex items-center gap-1">

                <span className="w-3 h-3 rounded-full bg-yellow-500" />

                Ovulation

              </span>

            </div>

          </Card>

          {/* TIPS */}
          <Card>

            <CardHeader>

              <CardTitle>
                Phase Tips: {phase}
              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-3">

                {phaseTips[phase]?.map((tip) => (

                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm"
                  >

                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2" />

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