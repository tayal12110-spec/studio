'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
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

type Holiday = {
  date: string;
  name: string;
};

const holidays2026: Holiday[] = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-02', name: 'Mannam Jayanthi' },
  { date: '2026-01-03', name: "Hazrat Ali's Birthday" },
  { date: '2026-01-05', name: 'Guru Gobind Singh Jayanti' },
  { date: '2026-01-11', name: 'Missionary Day' },
  { date: '2026-01-12', name: 'Swami Vivekananda Jayanti' },
  { date: '2026-01-14', name: 'Pongal' },
  { date: '2026-01-15', name: 'Thiruvalluvar Day' },
  { date: '2026-01-17', name: 'Uzhavar Thirunal' },
];

const HolidayItem = ({ holiday }: { holiday: Holiday }) => {
  const { toast } = useToast();
  const handleAdd = () => {
    toast({
      title: 'Holiday Added',
      description: `${holiday.name} has been added to the company holiday list.`,
    });
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{holiday.date}</p>
          <p className="font-semibold">{holiday.name}</p>
        </div>
        <Button variant="outline" className="text-accent border-accent hover:bg-accent/10 hover:text-accent" onClick={handleAdd}>
          ADD
        </Button>
      </CardContent>
    </Card>
  );
};

export default function HolidayListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [year, setYear] = useState<Date>(new Date(2026, 0, 1));

  const handleAddAll = () => {
    toast({
      title: 'All Holidays Added',
      description: 'All public holidays for 2026 have been added.',
    });
  };

  const handleAddNew = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'The ability to add custom holidays will be available soon.',
    });
  };

  return (
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
          {holidays2026.map((holiday) => (
            <HolidayItem key={holiday.date} holiday={holiday} />
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
  );
}
