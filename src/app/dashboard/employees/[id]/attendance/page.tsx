'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Calendar as CalendarIcon,
  Download,
  UserCheck,
  MapPin,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useDoc, useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import {
  doc,
  collection,
  query,
  where,
  DocumentReference,
  CollectionReference,
  Query
} from 'firebase/firestore';
import type { Employee, Attendance, AttendanceStatus } from '../../../data';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className={`flex-1 text-center border-r last:border-r-0 ${color} py-2`}>
    <p>{label}</p>
    <p className="font-bold text-2xl">{value}</p>
  </div>
);

const SalaryDetailRow = ({ label, value }: { label: string; value: number }) => (
    <div className="flex items-center justify-between px-4 py-3.5">
        <p className="text-base text-muted-foreground">{label}</p>
        <p className="font-semibold text-base">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}</p>
    </div>
);


export default function AttendancePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const [month, setMonth] = useState(new Date(2026, 0)); // Jan 2026
  const [activeTab, setActiveTab] = useState('attendance');

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } = useDoc<Employee>(employeeRef);

  const attendanceColRef = useMemoFirebase(
    () => (firestore && employeeId ? collection(firestore, 'employees', employeeId, 'attendance') : null),
    [firestore, employeeId]
  ) as CollectionReference | null;
  
  const attendanceQuery = useMemoFirebase(() => {
    if (!attendanceColRef) return null;
    const startDate = format(startOfMonth(month), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(month), 'yyyy-MM-dd');
    return query(attendanceColRef, where('date', '>=', startDate), where('date', '<=', endDate));
  }, [attendanceColRef, month]) as Query | null;

  const { data: attendanceData, isLoading: isLoadingAttendance } = useCollection<Attendance>(attendanceQuery);
  
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  }, [month]);

  const firstDayOfMonth = useMemo(() => getDay(startOfMonth(month)), [month]);

  const attendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    if (attendanceData) {
      attendanceData.forEach(att => {
        map.set(att.date, att.status);
      });
    }
    return map;
  }, [attendanceData]);

  const summary = useMemo(() => {
    const stats: Record<AttendanceStatus, number> = {
      'PRESENT': 0, 'ABSENT': 0, 'HALF DAY': 0, 'PAID LEAVE': 0, 'WEEK OFF': 0, 'HOLIDAY': 0, 'HALF DAY LEAVE': 0, 'UNPAID LEAVE': 0
    };

    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      let status = attendanceMap.get(dateStr);
      
      if (!status) {
        if (getDay(day) === 0) {
            status = 'WEEK OFF';
        } else {
            status = 'ABSENT';
        }
      }
      
      if(stats[status] !== undefined) {
           stats[status]++;
      }
    });
    
    return stats;
  }, [daysInMonth, attendanceMap]);

  const salaryDetails = useMemo(() => {
    if (!employee) {
      return {
        payableAmount: 0,
        payableDays: 0,
        earnings: { total: 0, basic: 0, bonus: 0, other: 0, workBasis: 0, overtime: 0, incentive: 0, reimbursement: 0 },
        deductions: { total: 0, loan: 0, earlyLeaving: 0, lateComing: 0, other: 0 },
        paidAmount: 0,
        remainingAmount: 0,
      };
    }

    const payableDays = summary.PRESENT + (summary['HALF DAY'] * 0.5) + summary['PAID LEAVE'] + (summary['HALF DAY LEAVE'] * 0.5);
    const numberOfDaysInMonth = daysInMonth.length > 0 ? daysInMonth.length : 30;
    const dailySalary = employee.baseSalary / numberOfDaysInMonth;
    const payableAmount = dailySalary * payableDays;
    
    return {
      payableAmount,
      payableDays,
      earnings: {
        total: payableAmount,
        basic: payableAmount,
        bonus: 0,
        other: 0,
        workBasis: 0,
        overtime: 0,
        incentive: 0,
        reimbursement: 0
      },
      deductions: {
        total: 0,
        loan: 0,
        earlyLeaving: 0,
        lateComing: 0,
        other: 0
      },
      paidAmount: 0,
      remainingAmount: payableAmount,
    };
  }, [employee, summary, daysInMonth.length]);

  const handleMarkAllPresent = () => {
    if (!firestore || !employeeId || !attendanceColRef) return;

    let updatedCount = 0;

    daysInMonth.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        let status = attendanceMap.get(dateStr);
        
        if (!status) {
            if (getDay(day) === 0) { // Sunday
                status = 'WEEK OFF';
            } else {
                status = 'ABSENT';
            }
        }
        
        if (status === 'ABSENT') {
            const attendanceDate = format(day, 'yyyy-MM-dd');
            const attendanceRef = doc(firestore, 'employees', employeeId, 'attendance', attendanceDate);

            const newAttendanceData = {
                employeeId,
                date: attendanceDate,
                status: 'PRESENT' as AttendanceStatus,
            };
            
            setDocumentNonBlocking(attendanceRef, newAttendanceData, { merge: true });
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        toast({
            title: 'Attendance Updated',
            description: `${updatedCount} absent day(s) have been marked as Present.`,
        });
    } else {
        toast({
            title: 'No Changes',
            description: 'There were no absent days to mark as present.',
        });
    }
  };

  const getDayClass = (day: Date) => {
    if (!isSameMonth(day, month)) {
      return 'text-muted-foreground opacity-50';
    }
    
    const dateStr = format(day, 'yyyy-MM-dd');
    let status = attendanceMap.get(dateStr);

    if (!status) {
      if (getDay(day) === 0) {
          status = 'WEEK OFF';
      } else {
          status = 'ABSENT';
      }
    }
    
    switch(status) {
        case 'PRESENT': return 'bg-green-500 text-white hover:bg-green-600';
        case 'ABSENT': return 'bg-red-500 text-white hover:bg-red-600';
        case 'HALF DAY': return 'bg-yellow-500 text-white hover:bg-yellow-600';
        case 'PAID LEAVE': return 'bg-purple-500 text-white hover:bg-purple-600';
        case 'HALF DAY LEAVE': return 'bg-fuchsia-500 text-white hover:bg-fuchsia-600';
        case 'UNPAID LEAVE': return 'bg-sky-500 text-white hover:bg-sky-600';
        case 'WEEK OFF':
        case 'HOLIDAY':
            return 'bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700';
        default: 
            return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const changeMonth = (offset: number) => {
      setMonth(currentMonth => offset > 0 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
  };
  
  const isLoading = isLoadingEmployee || isLoadingAttendance;

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarFallback>{employee?.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{employee?.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="default" size="sm" onClick={() => router.push(`/dashboard/employees/${employeeId}/edit`)}>EDIT</Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <Tabs defaultValue="attendance" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none">
            <TabsTrigger value="attendance">ATTENDANCE</TabsTrigger>
            <TabsTrigger value="salary">SALARY</TabsTrigger>
            <TabsTrigger value="notes">NOTES</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="m-0">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Info className="h-5 w-5 text-yellow-500" />
                    <span>Attendance For</span>
                 </div>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button variant={'outline'} className={cn('w-[150px] justify-between text-left font-normal', !month && 'text-muted-foreground')}>
                        {month ? format(month, 'MMM yyyy') : <span>Select month</span>}
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        onSelect={(date) => date && setMonth(date)}
                        initialFocus
                        defaultMonth={month}
                    />
                    </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                 <Button variant="ghost" className="flex-col h-auto text-blue-600">
                    <Download className="h-6 w-6"/>
                    <span className="text-sm mt-1">Download Report</span>
                 </Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="flex-col h-auto text-blue-600">
                            <UserCheck className="h-6 w-6"/>
                            <span className="text-sm mt-1">Mark All Present</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Mark All Absent as Present</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to mark all Absent days as Present?
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMarkAllPresent}>Mark Present</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                 <Button variant="ghost" className="flex-col h-auto text-blue-600">
                    <MapPin className="h-6 w-6"/>
                    <span className="text-sm mt-1">Live Location</span>
                 </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex rounded-lg border bg-card text-sm">
                    <StatCard label="Present" value={summary.PRESENT} color="text-green-600"/>
                    <StatCard label="Absent" value={summary.ABSENT} color="text-red-600"/>
                    <StatCard label="Half day" value={summary['HALF DAY']} color="text-yellow-600"/>
                    <StatCard label="Paid Leave" value={summary['PAID LEAVE'].toFixed(1)} color="text-purple-600"/>
                    <StatCard label="Week Off" value={summary['WEEK OFF']} color="text-gray-500"/>
                </div>
              )}

              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="font-medium text-muted-foreground">{d}</div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                  {daysInMonth.map(day => (
                      <div key={day.toString()}>
                          <Button 
                            variant="default" 
                            className={cn('w-full aspect-square p-0 h-auto rounded-lg', getDayClass(day))}
                            onClick={() => router.push(`/dashboard/employees/${employeeId}/edit-attendance?date=${format(day, 'yyyy-MM-dd')}`)}
                          >
                            {format(day, 'd')}
                          </Button>
                      </div>
                  ))}
              </div>

            </div>
          </TabsContent>
          <TabsContent value="salary" className="m-0 p-4 space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span>{format(month, 'MMM yyyy')}</span>
                </div>
                    <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
            
            <div className="space-y-3 p-2">
                <div className="flex justify-between items-center">
                    <p className="text-lg">Payable Amount</p>
                    <p className="text-xl font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salaryDetails.payableAmount)}</p>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <p>Payable Days - {salaryDetails.payableDays.toFixed(1)}</p>
                        <Info className="h-4 w-4" />
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Pay Slip
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="flex justify-between items-center p-3 bg-green-100/60 dark:bg-green-900/20">
                    <p className="font-semibold text-green-700 dark:text-green-300">Earnings</p>
                    <p className="font-semibold text-green-700 dark:text-green-300">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salaryDetails.earnings.total)}</p>
                </div>
                <SalaryDetailRow label="Basic" value={salaryDetails.earnings.basic} />
                <SalaryDetailRow label="Bonus" value={salaryDetails.earnings.bonus} />
                <SalaryDetailRow label="Other Earnings" value={salaryDetails.earnings.other} />
                <SalaryDetailRow label="Work Basis Pay" value={salaryDetails.earnings.workBasis} />
                <SalaryDetailRow label="Overtime" value={salaryDetails.earnings.overtime} />
                <SalaryDetailRow label="Incentive" value={salaryDetails.earnings.incentive} />
                <SalaryDetailRow label="Reimbursement" value={salaryDetails.earnings.reimbursement} />
            </div>
            
            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="flex justify-between items-center p-3 bg-red-100/60 dark:bg-red-900/20">
                    <p className="font-semibold text-red-700 dark:text-red-300">Deduction</p>
                    <p className="font-semibold text-red-700 dark:text-red-300">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salaryDetails.deductions.total)}</p>
                </div>
                <SalaryDetailRow label="Loan Repayment" value={salaryDetails.deductions.loan} />
                <SalaryDetailRow label="Early Leaving Fine" value={salaryDetails.deductions.earlyLeaving} />
                <SalaryDetailRow label="Late Coming Fine" value={salaryDetails.deductions.lateComing} />
                <SalaryDetailRow label="Other Deductions" value={salaryDetails.deductions.other} />
            </div>

            <div className="pt-4">
                    <div className="flex justify-between items-center px-2">
                    <p className="text-lg font-semibold">Paid Amount</p>
                    <p className="text-lg font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salaryDetails.paidAmount)}</p>
                </div>
                <p className="text-center text-muted-foreground text-sm py-8">No payments done yet</p>
            </div>
          </TabsContent>
          <TabsContent value="notes" className="p-4">
             <div className="text-center py-20 text-muted-foreground">
                No notes found.
             </div>
          </TabsContent>
        </Tabs>
      </main>
      {activeTab === 'attendance' && (
       <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button className="w-full h-12 text-base" variant="outline">
          Ask Staff To Mark Attendance
        </Button>
      </footer>
      )}
      {activeTab === 'salary' && (
        <footer className="sticky bottom-0 border-t bg-card p-4 flex items-center justify-between gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Remaining Amount</p>
                <p className="text-lg font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(salaryDetails.remainingAmount)}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="h-12 px-6">Pay Advance</Button>
                <Button className="h-12 px-8 bg-accent text-accent-foreground hover:bg-accent/90">Pay Salary</Button>
            </div>
        </footer>
      )}
    </div>
  );
}
