'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { ArrowLeft, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';


export default function BackgroundVerificationPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  
  const [isPastEmploymentDialogOpen, setIsPastEmploymentDialogOpen] = useState(false);
  const [pastEmploymentValue, setPastEmploymentValue] = useState('');

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId
        ? doc(firestore, 'employees', employeeId)
        : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const handleOpenPastEmploymentDialog = () => {
    setPastEmploymentValue(employee?.pastEmployment || '');
    setIsPastEmploymentDialogOpen(true);
  };

  const handleSavePastEmployment = () => {
    if (!employeeRef) return;
    setIsSaving(true);

    const updatedData = {
        pastEmployment: pastEmploymentValue
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


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                    {employee?.pastEmployment ? (
                        <>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium'>Past Employment</p>
                                <Button variant='outline' onClick={handleOpenPastEmploymentDialog}>Edit</Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 truncate max-w-xs">{employee.pastEmployment}</p>
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
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Add Past Employment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="past-employment-value">
                          Past Employment Details
                      </Label>
                      <Textarea
                          id="past-employment-value"
                          value={pastEmploymentValue}
                          onChange={(e) => setPastEmploymentValue(e.target.value)}
                          placeholder={`Enter past employment details`}
                      />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="outline">
                          Cancel
                      </Button>
                  </DialogClose>
                  <Button onClick={handleSavePastEmployment} disabled={isSaving || !pastEmploymentValue.trim()}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Save'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
