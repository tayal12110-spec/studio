'use client';

import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Download,
  MoreVertical,
  UserCheck,
  MapPin,
  Info,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, DocumentReference } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Employee } from '../../data';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const generateCalendarDays = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const daysInMonth = endDate.getDate();
  const startDay = startDate.getDay();

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push({ day: null, status: 'empty' });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    if (i === 1) days.push({ day: i, status: 'present' });
    else if (i > 1 && i <= 22) days.push({ day: i, status: 'absent' });
    else days.push({ day: i, status: 'future' });
  }
  return days;
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const [currentDate, setCurrentDate] = useState(
    new Date('2026-01-01T00:00:00')
  );

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId ? doc(firestore, 'employees', employeeId) : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const calendarDays = generateCalendarDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!employee) {
    return <div className="p-4">Employee not found.</div>;
  }

  const attendanceStats = [
    { label: 'Present', value: 1, color: 'text-green-600' },
    { label: 'Absent', value: 21, color: 'text-red-600' },
    { label: 'Half day', value: 0, color: 'text-yellow-600' },
    { label: 'Paid Leave', value: '0.0', color: 'text-purple-600' },
    { label: 'Week Off', value: 0, color: 'text-gray-600' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees" passHref>
            <Button variant="ghost" size="icon" aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 bg-primary text-primary-foreground">
              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{employee.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">EDIT</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Delete Employee</DropdownMenuItem>
              <DropdownMenuItem>Deactivate Employee</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none bg-card">
            <TabsTrigger value="attendance">ATTENDANCE</TabsTrigger>
            <TabsTrigger value="salary">SALARY</TabsTrigger>
            <TabsTrigger value="notes">NOTES</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="m-0 space-y-4 p-4">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-5 w-5 text-amber-500" />
                  <span>Attendance For</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-auto justify-start text-left font-normal',
                        !currentDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentDate ? (
                        format(currentDate, 'MMM yyyy')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={currentDate}
                      onSelect={(date) => date && setCurrentDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <Button variant="link" className="font-semibold text-primary">
                <Download className="mr-1 h-4 w-4" />
                Download Report
              </Button>
              <Button variant="link" className="font-semibold text-primary">
                <UserCheck className="mr-1 h-4 w-4" />
                Mark All Present
              </Button>
              <Button variant="link" className="font-semibold text-primary">
                <MapPin className="mr-1 h-4 w-4" />
                Live Location
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-5 divide-x divide-gray-200 text-center">
                  {attendanceStats.map((stat) => (
                    <div key={stat.label} className={'p-3'}>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2">
                <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <div key={day} className="py-2">
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {calendarDays.map((day, index) => {
                    if (day.day === null) {
                      return <div key={index} className="h-9 w-9" />;
                    }

                    const dayDate = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day.day
                    );
                    const dateString = format(dayDate, 'yyyy-MM-dd');

                    return (
                      <Link
                        key={index}
                        href={`/dashboard/employees/${employeeId}/edit-attendance?date=${dateString}`}
                        className="flex items-center justify-center rounded-md transition-colors hover:bg-muted"
                      >
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold cursor-pointer',
                            day.status === 'present' &&
                              'bg-green-500 text-white',
                            day.status === 'absent' && 'bg-red-500 text-white',
                            day.status === 'future' &&
                              'bg-gray-200 text-gray-500',
                          )}
                        >
                          {day.day}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="salary" className="p-4">
            Salary details will go here.
          </TabsContent>
          <TabsContent value="notes" className="p-4">
            Notes will go here.
          </TabsContent>
        </Tabs>
      </main>
      <footer className="fixed bottom-0 z-10 w-full border-t bg-card p-4">
        <Button className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90">
          Ask Staff To Mark Attendance
        </Button>
      </footer>
    </div>
  );
}
