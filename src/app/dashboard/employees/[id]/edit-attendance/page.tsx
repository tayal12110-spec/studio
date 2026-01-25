'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, RotateCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, DocumentReference } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Employee } from '../../data';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type AttendanceOption = 'ABSENT' | 'HALF DAY' | 'PRESENT' | 'WEEK OFF' | 'HOLIDAY' | 'PAID LEAVE' | 'HALF DAY LEAVE' | 'UNPAID LEAVE';

const attendanceStatuses: AttendanceOption[] = ['ABSENT', 'HALF DAY', 'PRESENT', 'WEEK OFF', 'HOLIDAY'];
const leaveTypes: AttendanceOption[] = ['PAID LEAVE', 'HALF DAY LEAVE', 'UNPAID LEAVE'];

export default function EditAttendancePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const employeeId = params.id as string;
  const dateStr = searchParams.get('date');
  const selectedDate = dateStr && isValid(parseISO(dateStr)) ? parseISO(dateStr) : new Date();

  const firestore = useFirestore();

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } = useDoc<Employee>(employeeRef);

  const [selectedStatus, setSelectedStatus] = useState<AttendanceOption>('ABSENT');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    console.log('Saving attendance:', {
      employeeId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: selectedStatus,
      note,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: 'Attendance Updated',
      description: `Attendance for ${employee?.name} on ${format(selectedDate, 'do MMMM yyyy')} has been updated.`,
    });
    setIsSaving(false);
    router.back();
  };
  
  if (isLoadingEmployee) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!employee) {
    return <div className="p-4 text-center">Employee not found.</div>;
  }
  
  const getButtonClass = (option: AttendanceOption, isSelected: boolean) => {
    if (isSelected) {
      switch(option) {
        case 'ABSENT': return 'bg-red-500 hover:bg-red-600 text-white border-transparent';
        case 'HALF DAY': return 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent';
        case 'PRESENT': return 'bg-green-500 hover:bg-green-600 text-white border-transparent';
        case 'WEEK OFF':
        case 'HOLIDAY':
          return 'bg-gray-700 hover:bg-gray-800 text-white border-transparent';
        case 'PAID LEAVE': return 'bg-purple-500 hover:bg-purple-600 text-white border-transparent';
        case 'HALF DAY LEAVE': return 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white border-transparent';
        case 'UNPAID LEAVE': return 'bg-sky-500 hover:bg-sky-600 text-white border-transparent';
        default: return 'bg-primary text-primary-foreground';
      }
    } else {
       switch(option) {
        case 'ABSENT': return 'text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700';
        case 'HALF DAY': return 'text-yellow-600 border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700';
        case 'PRESENT': return 'text-green-600 border-green-400 hover:bg-green-50 hover:text-green-700';
        case 'WEEK OFF':
        case 'HOLIDAY':
          return 'text-gray-600 border-gray-300 hover:bg-gray-100';
        case 'PAID LEAVE': return 'text-purple-600 border-purple-300 hover:bg-purple-50 hover:text-purple-700';
        case 'HALF DAY LEAVE': return 'text-fuchsia-600 border-fuchsia-300 hover:bg-fuchsia-50 hover:text-fuchsia-700';
        case 'UNPAID LEAVE': return 'text-sky-600 border-sky-400 hover:bg-sky-50 hover:text-sky-700';
        default: return 'text-muted-foreground';
      }
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="ml-4 text-lg font-semibold">{employee.name}: Edit Attendance</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-xl space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{format(selectedDate, "do MMMM yyyy")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedStatus('ABSENT')}>
                <RotateCw className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Reset</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {attendanceStatuses.map((s) => (
                <Button
                  key={s}
                  variant='outline'
                  onClick={() => setSelectedStatus(s)}
                  className={cn('rounded-full px-5 py-2 text-sm', getButtonClass(s, selectedStatus === s))}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Leaves</h3>
            <div className="flex flex-wrap gap-3">
              {leaveTypes.map((l) => (
                 <Button
                  key={l}
                  variant='outline'
                  onClick={() => setSelectedStatus(l)}
                  className={cn('rounded-full px-5 py-2 text-sm', getButtonClass(l, selectedStatus === l))}
                 >
                   {l}
                 </Button>
              ))}
            </div>
          </div>

          <div>
            <Button variant="link" className="p-0 h-auto text-base text-primary font-semibold">
              + ADD PUNCH IN
            </Button>
          </div>

          <div className="space-y-2">
             <label htmlFor="note" className="font-semibold text-foreground">Add Note</label>
             <Textarea id="note" placeholder="Add a note..." value={note} onChange={(e) => setNote(e.target.value)} rows={4}/>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
        <div className="mx-auto max-w-xl">
          <Button onClick={handleSave} className="w-full h-12 text-base" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Update Attendance'}
          </Button>
        </div>
      </footer>
    </div>
  );
}
