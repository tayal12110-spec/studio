'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  FileText,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import {
  useDoc,
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

export default function CurrentEmploymentPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  const firestore = useFirestore();
  const { toast } = useToast();

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId
        ? doc(firestore, 'employees', employeeId)
        : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } =
    useDoc<Employee>(employeeRef);

  const [branch, setBranch] = useState('');
  const [department, setDepartment] = useState<Employee['department']>();
  const [employeeType, setEmployeeType] = useState<Employee['employeeType']>();
  const [jobTitle, setJobTitle] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState<Date | undefined>();
  const [dateOfLeaving, setDateOfLeaving] = useState<Date | undefined>();
  const [officialEmail, setOfficialEmail] = useState('');
  const [pfAccountNumber, setPfAccountNumber] = useState('');
  const [esiAccountNumber, setEsiAccountNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (employee) {
        setBranch(employee.branch || 'tit'); // Defaulting 'tit' as per screenshot
        setDepartment(employee.department);
        setEmployeeType(employee.employeeType || 'Full Time');
        setJobTitle(employee.jobTitle || '');
        setDateOfJoining(employee.dateOfJoining && isValid(parseISO(employee.dateOfJoining)) ? parseISO(employee.dateOfJoining) : undefined);
        setDateOfLeaving(employee.dateOfLeaving && isValid(parseISO(employee.dateOfLeaving)) ? parseISO(employee.dateOfLeaving) : undefined);
        setOfficialEmail(employee.email || '');
        setPfAccountNumber(employee.pfAccountNumber || '');
        setEsiAccountNumber(employee.esiAccountNumber || '');
    }
  }, [employee]);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeRef) {
      setIsSaving(true);
      const updatedData: Partial<Employee> = {
        branch,
        department,
        employeeType,
        jobTitle,
        dateOfJoining: dateOfJoining ? format(dateOfJoining, 'yyyy-MM-dd') : undefined,
        dateOfLeaving: dateOfLeaving ? format(dateOfLeaving, 'yyyy-MM-dd') : undefined,
        email: officialEmail,
        pfAccountNumber,
        esiAccountNumber,
      };

      updateDocumentNonBlocking(employeeRef, updatedData);

      toast({
        title: 'Details Saved!',
        description: `${employee?.name}'s employment details have been updated.`,
      });

      setTimeout(() => {
        setIsSaving(false);
        router.back();
      }, 500);
    }
  };
  
  if (isLoadingEmployee) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className='flex items-center'>
            <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-lg font-semibold">Current Employment</h1>
          </div>
          <Button variant='outline'>
            <FileText className='mr-2 h-4 w-4' />
            Biodata
          </Button>
        </header>

        <form onSubmit={handleSaveDetails} className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Select onValueChange={setBranch} value={branch}>
                        <SelectTrigger id="branch" className="mt-1">
                            <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tit">tit</SelectItem>
                            <SelectItem value="Main">Main</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={(value: any) => setDepartment(value)} value={department}>
                        <SelectTrigger id="department" className="mt-1">
                        <SelectValue placeholder="All Departments Assigned" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="employee-type">Employee Type</Label>
                    <Select onValueChange={(value: any) => setEmployeeType(value)} value={employeeType}>
                        <SelectTrigger id="employee-type" className="mt-1">
                            <SelectValue placeholder="eg. Full Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Full Time">Full Time</SelectItem>
                            <SelectItem value="Part Time">Part Time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div>
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" placeholder="Staff Title" className="mt-1" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="dateOfJoining">Date Of Joining</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-between text-left font-normal mt-1",
                            !dateOfJoining && "text-muted-foreground"
                            )}
                        >
                            {dateOfJoining ? format(dateOfJoining, "dd/MM/yyyy") : <span>DD/MM/YYYY</span>}
                            <CalendarIcon className="h-4 w-4" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateOfJoining} onSelect={setDateOfJoining} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <Label htmlFor="dateOfLeaving">Date Of Leaving</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-between text-left font-normal mt-1",
                            !dateOfLeaving && "text-muted-foreground"
                            )}
                        >
                            {dateOfLeaving ? format(dateOfLeaving, "dd/MM/yyyy") : <span>DD/MM/YYYY</span>}
                            <CalendarIcon className="h-4 w-4" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateOfLeaving} onSelect={setDateOfLeaving} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <Label htmlFor="employee-id">Employee ID</Label>
                    <Input id="employee-id" placeholder="eg. 001ABC" className="mt-1" value={employee?.employeeId || ''} disabled />
                </div>

                <div>
                    <Label htmlFor="official-email">Official Email ID</Label>
                    <Input id="official-email" type="email" placeholder="example@gmail.com" className="mt-1" value={officialEmail} onChange={(e) => setOfficialEmail(e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="pf-account">PF A/C No.</Label>
                    <Input id="pf-account" placeholder="Enter the PF A/C No." className="mt-1" value={pfAccountNumber} onChange={(e) => setPfAccountNumber(e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="esi-account">ESI A/C No.</Label>
                    <Input id="esi-account" placeholder="Enter the ESI A/C No." className="mt-1" value={esiAccountNumber} onChange={(e) => setEsiAccountNumber(e.target.value)} />
                </div>
            </div>
          </main>

          <footer className="shrink-0 border-t bg-card p-4">
            <Button
              type="submit"
              className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Details'}
            </Button>
          </footer>
        </form>
      </div>
    </>
  );
}
