'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Holiday = {
  date: string;
  name: string;
};

const publicHolidays2026: Holiday[] = [
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-01-02', name: 'Mannam Jayanthi' },
    { date: '2026-01-03', name: "Hazrat Ali's Birthday" },
    { date: '2026-01-05', name: 'Guru Gobind Singh Jayanti' },
    { date: '2026-01-11', name: 'Missionary Day' },
    { date: '2026-01-12', name: 'Swami Vivekananda Jayanti' },
    { date: '2026-01-14', name: 'Pongal' },
    { date: '2026-01-15', name: 'Thiruvalluvar Day' },
    { date: '2026-01-17', name: 'Uzhavar Thirunal' },
    { date: '2026-01-18', name: 'Sonam Lhosar' },
    { date: '2026-01-23', name: 'Vasant Panchami' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-02-01', name: 'Guru Ravidas Jayanti' },
    { date: '2026-02-15', name: 'Maha Shivaratri' },
    { date: '2026-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti' },
    { date: '2026-03-03', name: 'Holika Dahan' },
    { date: '2026-03-04', name: 'Holi' },
    { date: '2026-03-17', name: 'Shab-i-Qadr' },
    { date: '2026-03-20', name: 'Ugadi' },
    { date: '2026-03-21', name: 'Eid-ul-Fitr' },
    { date: '2026-03-28', name: 'Ram Navami' },
    { date: '2026-03-31', name: 'Mahavir Jayanti' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-04-14', name: 'Vaisakhi' },
    { date: '2026-04-15', name: 'Bohag Bihu' },
    { date: '2026-05-01', name: 'Labour Day' },
    { date: '2026-05-09', name: 'Birthday of Rabindranath Tagore' },
    { date: '2026-05-27', name: 'Eid-ul-Zuha / Bakrid' },
    { date: '2026-06-25', name: 'Ashura' },
    { date: '2026-07-15', name: 'Rath Yatra' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-08-28', name: 'Onam' },
    { date: '2026-09-04', name: 'Janmashtami' },
    { date: '2026-09-14', name: 'Ganesh Chaturthi' },
    { date: '2026-10-02', name: 'Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Dussehra' },
    { date: '2026-10-25', name: 'Maharishi Valmiki Jayanti' },
    { date: '2026-10-29', name: 'Karwa Chauth' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-11-09', name: 'Govardhan Puja' },
    { date: '2026-11-11', name: 'Bhai Dooj' },
    { date: '2026-11-18', name: 'Chhath Puja' },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
    { date: '2026-12-24', name: 'Christmas Eve' },
    { date: '2026-12-25', name: 'Christmas Day' },
    { date: '2026-12-31', name: "New Year's Eve" },
];

const HolidayItem = ({ holiday, onRemove }: { holiday: Holiday, onRemove: (date: string) => void }) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{holiday.date}</p>
          <p className="font-semibold">{holiday.name}</p>
        </div>
        <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold" onClick={() => onRemove(holiday.date)}>
          REMOVE
        </Button>
      </CardContent>
    </Card>
  );
};

export default function HolidayListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [year, setYear] = useState<Date>(new Date(2026, 0, 1));
  const [holidays, setHolidays] = useState<Holiday[]>(publicHolidays2026);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState<Date | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const handleAddAll = () => {
    setHolidays(publicHolidays2026);
    toast({
      title: 'All Holidays Added',
      description: 'All public holidays for 2026 have been added.',
    });
  };

  const handleRemove = (date: string) => {
    setHolidays(currentHolidays => currentHolidays.filter(h => h.date !== date));
    toast({
        title: 'Holiday Removed',
        variant: 'destructive',
    });
  };
  
  const handleAddNew = () => {
    setIsDialogOpen(true);
  };
  
  const handleSaveNewHoliday = () => {
      if (!newHolidayName.trim() || !newHolidayDate) {
          toast({
              variant: 'destructive',
              title: 'Missing information',
              description: 'Please provide a name and a date.',
          });
          return;
      }
      setIsSaving(true);
      
      const newHoliday: Holiday = {
          name: newHolidayName,
          date: format(newHolidayDate, 'yyyy-MM-dd'),
      };
      
      if (holidays.some(h => h.date === newHoliday.date)) {
          toast({
              variant: 'destructive',
              title: 'Duplicate Date',
              description: 'A holiday already exists on this date.',
          });
          setIsSaving(false);
          return;
      }

      setTimeout(() => {
          setHolidays(prev => [...prev, newHoliday].sort((a, b) => a.date.localeCompare(b.date)));
          setIsSaving(false);
          setIsDialogOpen(false);
          setNewHolidayName('');
          setNewHolidayDate(undefined);
          toast({
              title: 'Holiday Added',
              description: `"${newHolidayName}" has been added.`,
          });
      }, 500);
  };

  return (
    <>
      <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Go back"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Holiday List</h1>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[120px] justify-between text-left font-normal',
                  !year && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {year ? format(year, 'yyyy') : <span>Select year</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={year}
                onSelect={(date) => date && setYear(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-32">
          <div className="space-y-3">
            {holidays.map((holiday) => (
              <HolidayItem key={holiday.date} holiday={holiday} onRemove={handleRemove} />
            ))}
          </div>
        </main>

        <footer className="sticky bottom-0 space-y-3 border-t bg-card p-4">
          <Button
            variant="outline"
            className="h-12 w-full text-base text-accent border-accent hover:bg-accent/10 hover:text-accent"
            onClick={handleAddAll}
          >
            Add all Public Holidays
          </Button>
          <Button
            onClick={handleAddNew}
            className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
          >
            Add New Holidays
          </Button>
        </footer>
      </div>
      
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Holiday</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="holiday-name">Holiday Name</Label>
              <Input id="holiday-name" value={newHolidayName} onChange={(e) => setNewHolidayName(e.target.value)} className="mt-1" placeholder="Holiday Name" />
            </div>
            <div>
              <Label htmlFor="holiday-date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="holiday-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !newHolidayDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newHolidayDate ? format(newHolidayDate, "PPP") : <span>Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newHolidayDate}
                    onSelect={setNewHolidayDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveNewHoliday}
              disabled={isSaving}
              className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Holiday
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
