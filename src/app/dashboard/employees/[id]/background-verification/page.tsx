'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { ArrowLeft, Loader2, ShieldCheck, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from '@/lib/utils';


export default function BackgroundVerificationPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  
  const [isPastEmploymentDialogOpen, setIsPastEmploymentDialogOpen] = useState(false);
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState<Date | undefined>();
  const [leavingDate, setLeavingDate] = useState<Date | undefined>();
  const [currency, setCurrency] = useState('INR');
  const [salary, setSalary] = useState('');
  const [companyGst, setCompanyGst] = useState('');


  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId
        ? doc(firestore, 'employees', employeeId)
        : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const handleOpenPastEmploymentDialog = () => {
    if (employee?.pastEmployment && typeof employee.pastEmployment !== 'string') {
        setCompanyName(employee.pastEmployment.companyName || '');
        setDesignation(employee.pastEmployment.designation || '');
        setJoiningDate(employee.pastEmployment.joiningDate && isValid(parseISO(employee.pastEmployment.joiningDate)) ? parseISO(employee.pastEmployment.joiningDate) : undefined);
        setLeavingDate(employee.pastEmployment.leavingDate && isValid(parseISO(employee.pastEmployment.leavingDate)) ? parseISO(employee.pastEmployment.leavingDate) : undefined);
        setCurrency(employee.pastEmployment.currency || 'INR');
        setSalary(employee.pastEmployment.salary?.toString() || '');
        setCompanyGst(employee.pastEmployment.companyGst || '');
    } else {
        // Reset form for adding new or for old string format
        setCompanyName('');
        setDesignation('');
        setJoiningDate(undefined);
        setLeavingDate(undefined);
        setCurrency('INR');
        setSalary('');
        setCompanyGst('');
    }
    setIsPastEmploymentDialogOpen(true);
  };

  const handleSavePastEmployment = () => {
    if (!employeeRef) return;
    setIsSaving(true);

    const updatedData = {
        pastEmployment: {
            companyName,
            designation,
            joiningDate: joiningDate ? format(joiningDate, 'yyyy-MM-dd') : '',
            leavingDate: leavingDate ? format(leavingDate, 'yyyy-MM-dd') : '',
            currency,
            salary: salary ? Number(salary) : 0,
            companyGst,
        }
    };

    updateDocumentNonBlocking(employeeRef, updatedData);

    toast({
      title: 'Past Employment Saved!',
      description: `The past employment details have been saved.`,
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsPastEmploymentDialogOpen(false);
    }, 500);
  };
  
  const isFormValid = companyName.trim() && joiningDate && leavingDate;


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const pastEmploymentDisplay = employee?.pastEmployment
    ? (typeof employee.pastEmployment === 'string' ? employee.pastEmployment : employee.pastEmployment.companyName)
    : null;

  return (
    <>
      <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-950">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">
            Background Verification: {employee?.name || ''}
          </h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4">
          <Card className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className='flex items-center gap-3 p-4'>
                  <div className='bg-blue-600 text-white p-2 rounded-lg'>
                      <ShieldCheck className='h-6 w-6' />
                  </div>
                  <div>
                      <p className='font-semibold text-blue-800 dark:text-blue-200'>Verify staff's Past employment details to safeguard your business against Identity theft and fraud</p>
                  </div>
              </CardContent>
          </Card>

            <Card className='mb-4'>
                <CardContent className='p-4'>
                    {pastEmploymentDisplay ? (
                        <>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium'>Past Employment</p>
                                <Button variant='outline' onClick={handleOpenPastEmploymentDialog}>Edit</Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 truncate max-w-xs">{pastEmploymentDisplay}</p>
                        </>
                    ) : (
                        <div className='flex items-center justify-between'>
                            <p>Past Employment <span className='text-muted-foreground'>Not Added</span></p>
                            <Button onClick={handleOpenPastEmploymentDialog}>Add</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className='flex items-center justify-between p-4'>
                    <p className='font-medium'>Verification Status</p>
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-semibold">Not Verified</span>
                    </div>
                </CardContent>
            </Card>
        </main>
      </div>

      <Dialog open={isPastEmploymentDialogOpen} onOpenChange={setIsPastEmploymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Past Employment Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2 px-1">
                      <Label htmlFor="company-name">Company Name <span className="text-red-500">*</span></Label>
                      <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </div>
                  <div className="space-y-2 px-1">
                      <Label htmlFor="designation">Designation</Label>
                      <Input id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                  </div>
                   <div className="space-y-2 px-1">
                        <Label htmlFor="joining-date">Joining Date <span className="text-red-500">*</span></Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-full justify-between text-left font-normal", !joiningDate && "text-muted-foreground")}
                            >
                                {joiningDate ? format(joiningDate, "dd/MM/yyyy") : <span>Select date</span>}
                                <CalendarIcon className="h-4 w-4" />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={joiningDate} onSelect={setJoiningDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2 px-1">
                        <Label htmlFor="leaving-date">Leaving Date <span className="text-red-500">*</span></Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-full justify-between text-left font-normal", !leavingDate && "text-muted-foreground")}
                            >
                                {leavingDate ? format(leavingDate, "dd/MM/yyyy") : <span>Select date</span>}
                                <CalendarIcon className="h-4 w-4" />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={leavingDate} onSelect={setLeavingDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-2 gap-4 px-1">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select onValueChange={setCurrency} value={currency}>
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">INR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary</Label>
                            <Input id="salary" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2 px-1">
                      <Label htmlFor="company-gst">Company GST</Label>
                      <Input id="company-gst" value={companyGst} onChange={(e) => setCompanyGst(e.target.value)} />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="outline">
                          Cancel
                      </Button>
                  </DialogClose>
                  <Button onClick={handleSavePastEmployment} disabled={isSaving || !isFormValid} className="bg-accent text-accent-foreground hover:bg-accent/90">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Add'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
