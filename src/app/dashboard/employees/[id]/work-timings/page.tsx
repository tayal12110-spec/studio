'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const fixedDays: { key: DayKey; label: string; fullName: string; required: boolean }[] = [
    { key: 'mon', label: 'Mon', fullName: 'Monday', required: true },
    { key: 'tue', label: 'Tue', fullName: 'Tuesday', required: true },
    { key: 'wed', label: 'Wed', fullName: 'Wednesday', required: true },
    { key: 'thu', label: 'Thu', fullName: 'Thursday', required: true },
    { key: 'fri', label: 'Fri', fullName: 'Friday', required: true },
    { key: 'sat', label: 'Sat', fullName: 'Saturday', required: false },
    { key: 'sun', label: 'Sun', fullName: 'Sunday', required: false },
];

const weekLabels = ['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week'];

export default function WorkTimingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [workType, setWorkType] = useState<'fixed' | 'flexible' | undefined>('fixed');

  // State for Fixed schedule
  const [weekoffs, setWeekoffs] = useState<Record<DayKey, boolean>>({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: true,
    sun: true,
  });

  const [weekSettings, setWeekSettings] = useState<Record<DayKey, boolean[]>>({
    mon: [false, false, false, false, false],
    tue: [false, false, false, false, false],
    wed: [false, false, false, false, false],
    thu: [false, false, false, false, false],
    fri: [false, false, false, false, false],
    sat: [true, true, true, true, true],
    sun: [true, true, true, true, true],
  });

  // State for Flexible schedule
  const [month, setMonth] = useState(new Date(2026, 0, 1)); // January 2026 as per screenshot
  const [flexibleDaySettings, setFlexibleDaySettings] = useState<Record<string, { weekoff: boolean }>>({});

  // Dialog State
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<{ key: DayKey; label: string; fullName: string; } | null>(null);
  const [dialogWeeks, setDialogWeeks] = useState<boolean[]>([]);
  
  const allWeeksInDialog = dialogWeeks.every(w => w);

  useEffect(() => {
    // This effect synchronizes the main "weekoff" checkbox with the individual week settings.
    const newWeekoffs: Record<DayKey, boolean> = {} as Record<DayKey, boolean>;
    
    for (const dayKey in weekSettings) {
      const key = dayKey as DayKey;
      const allWeeksOff = weekSettings[key].every(w => w);
      newWeekoffs[key] = allWeeksOff;
    }

    // Only update state if the derived state is different from the current state.
    // This prevents an infinite loop.
    if (JSON.stringify(weekoffs) !== JSON.stringify(newWeekoffs)) {
        setWeekoffs(newWeekoffs);
    }
  }, [weekSettings, weekoffs]);


  const handleWeekoffChange = (day: DayKey, checked: boolean) => {
    setWeekSettings(prev => ({ ...prev, [day]: Array(5).fill(checked) }));
  };

  const handleShiftClick = (day: { key: DayKey; label: string; fullName: string; }) => {
    setEditingDay(day);
    setDialogWeeks(weekSettings[day.key]);
    setIsShiftDialogOpen(true);
  };
  
  const handleDialogAllWeeksChange = (checked: boolean) => {
    setDialogWeeks(Array(5).fill(checked));
  }
  
  const handleDialogWeekChange = (index: number, checked: boolean) => {
    const newWeeks = [...dialogWeeks];
    newWeeks[index] = checked;
    setDialogWeeks(newWeeks);
  }

  const handleConfirmWeekOffs = () => {
    if (editingDay) {
      setWeekSettings(prev => ({...prev, [editingDay.key]: dialogWeeks }));
    }
    setIsShiftDialogOpen(false);
  }

  const getShiftText = (dayKey: DayKey) => {
    const specificWeekOffs = weekSettings[dayKey];
    const allWeeksAreOff = specificWeekOffs.every(w => w);
    const noWeeksAreOff = specificWeekOffs.every(w => !w);

    if (allWeeksAreOff) {
      if (dayKey === 'sat') return 'All saturdays week off';
      if (dayKey === 'sun') return 'All sundays week off';
      return 'Week off';
    }
    
    if (noWeeksAreOff) {
        return 'Select Shift';
    }

    const weekIndices = specificWeekOffs.map((isOff, i) => isOff ? i + 1 : -1).filter(i => i > -1);
    const ordinals: {[key: number]: string} = {1: 'st', 2: 'nd', 3: 'rd'};
    return weekIndices.map(i => `${i}${ordinals[i] || 'th'}`).join(', ') + ` week off`;
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });

  const handleFlexibleWeekoffChange = (date: string, checked: boolean) => {
    setFlexibleDaySettings(prev => ({
      ...prev,
      [date]: { ...prev[date], weekoff: checked }
    }));
  };

  const handleUpdate = () => {
    toast({
      title: 'Details Updated',
      description: 'Work timings have been saved.',
    });
    router.back();
  };

  return (
    <>
      <div className="flex h-full flex-col bg-background">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Work Timings</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <RadioGroup
                onValueChange={(value: 'fixed' | 'flexible') => setWorkType(value)}
                value={workType}
                className="flex items-center space-x-6"
              >
                <Label className="flex-1 text-base font-medium">Select Type</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="font-normal">Fixed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible" className="font-normal">Flexible</Label>
                </div>
              </RadioGroup>
            </div>

            {workType === 'fixed' && (
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_auto_2fr] items-center gap-x-4 px-1 pb-2 text-sm font-medium text-muted-foreground">
                  <span>Day</span>
                  <span>Weekoff</span>
                  <span>Shifts</span>
                </div>
                {fixedDays.map(day => (
                  <div key={day.key} className="grid grid-cols-[1fr_auto_2fr] items-center gap-x-4">
                    <div className="flex items-center gap-1">
                      {day.required && <span className="text-red-500">*</span>}
                      <Label htmlFor={`weekoff-${day.key}`} className="font-medium">
                        {day.label}
                      </Label>
                    </div>
                    <Checkbox
                      id={`weekoff-${day.key}`}
                      checked={weekoffs[day.key]}
                      onCheckedChange={(checked) => handleWeekoffChange(day.key, !!checked)}
                    />
                     <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => handleShiftClick(day)}
                    >
                      {getShiftText(day.key)}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {workType === 'flexible' && (
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                      <Label className="font-medium"><span className="text-red-500">*</span>Select Month</Label>
                      <Popover>
                          <PopoverTrigger asChild>
                          <Button
                              variant={"outline"}
                              className={cn(
                              "w-[200px] justify-between text-left font-normal",
                              !month && "text-muted-foreground"
                              )}
                          >
                              {month ? format(month, "MMMM yyyy") : <span>Select month</span>}
                              <CalendarIcon className="h-4 w-4" />
                          </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                          <Calendar
                              mode="single"
                              selected={month}
                              onSelect={(date) => date && setMonth(date)}
                              initialFocus
                          />
                          </PopoverContent>
                      </Popover>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_2fr] items-center gap-x-4 px-1 pb-2 text-sm font-medium text-muted-foreground">
                      <span>Day</span>
                      <span>Weekoff</span>
                      <span>Shifts</span>
                  </div>
                  {daysInMonth.map(day => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const isWeekoff = flexibleDaySettings[dayKey]?.weekoff ?? false;
                    return (
                        <div key={dayKey} className="grid grid-cols-[1fr_auto_2fr] items-center gap-x-4">
                            <div>
                                <p className="font-medium">{format(day, 'MMM dd')}</p>
                                <p className="text-xs text-muted-foreground">{format(day, 'E')}</p>
                            </div>
                            <Checkbox
                                checked={isWeekoff}
                                onCheckedChange={(checked) => handleFlexibleWeekoffChange(dayKey, !!checked)}
                            />
                            <Input
                                placeholder="Select Shift"
                                disabled={isWeekoff}
                            />
                        </div>
                    )
                  })}
              </div>
            )}

            {!workType && (
              <div className="text-center text-muted-foreground pt-10">
                <p>Select type to set Work Timings</p>
              </div>
            )}
          </div>
        </main>

        <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
          <Button onClick={handleUpdate} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90" disabled={!workType}>
            Update Details
          </Button>
        </footer>
      </div>
      <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDay?.fullName} - Week Offs</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                  <Label htmlFor="all-weeks" className="text-base font-medium">All Weeks</Label>
                  <Checkbox id="all-weeks" checked={allWeeksInDialog} onCheckedChange={handleDialogAllWeeksChange} />
              </div>
              {weekLabels.map((label, index) => (
                  <div key={index} className="flex items-center justify-between">
                      <Label htmlFor={`week-${index}`} className="font-normal">{label}</Label>
                      <Checkbox id={`week-${index}`} checked={dialogWeeks[index] || false} onCheckedChange={(checked) => handleDialogWeekChange(index, !!checked)} />
                  </div>
              ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleConfirmWeekOffs} className="bg-accent text-accent-foreground hover:bg-accent/90">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
