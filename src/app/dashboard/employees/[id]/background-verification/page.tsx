'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { ArrowLeft, Loader2, ShieldCheck, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type IdProof = {
    key: keyof Employee;
    label: string;
};

const idProofs: IdProof[] = [
    { key: 'aadhaarNumber', label: 'Aadhaar' },
    { key: 'panNumber', label: 'PAN' },
    { key: 'drivingLicenseNumber', label: 'Driving License' },
    { key: 'voterIdNumber', label: 'Voter ID' },
    { key: 'uanNumber', label: 'UAN' },
];

export default function BackgroundVerificationPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProof, setCurrentProof] = useState<IdProof | null>(null);
  const [proofValue, setProofValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId
        ? doc(firestore, 'employees', employeeId)
        : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const handleOpenDialog = (proof: IdProof) => {
    setCurrentProof(proof);
    setProofValue((employee?.[proof.key] as string) || '');
    setIsDialogOpen(true);
  };

  const handleSaveProof = () => {
    if (!employeeRef || !currentProof) return;
    setIsSaving(true);
    
    const updatedData = {
        [currentProof.key]: proofValue
    };

    updateDocumentNonBlocking(employeeRef, updatedData);

    toast({
      title: 'ID Proof Saved!',
      description: `The ${currentProof.label} number has been saved.`,
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsDialogOpen(false);
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
              <CardContent className='flex items-center justify-between p-4'>
                  <div className='flex items-center gap-3'>
                      <div className='bg-blue-600 text-white p-2 rounded-lg'>
                          <ShieldCheck className='h-6 w-6' />
                      </div>
                      <div>
                          <p className='font-semibold text-blue-800 dark:text-blue-200'>Verify staff to prevent fraud for ₹ 350 only !</p>
                      </div>
                  </div>
                  <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                      Start Verification
                  </Button>
              </CardContent>
          </Card>

          <Card className='mb-4'>
              <CardHeader>
                  <CardTitle className='text-lg'>ID Proofs</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                  {idProofs.map(proof => {
                      const value = employee?.[proof.key] as string;
                      return (
                          <div key={proof.key} className='flex items-center justify-between rounded-lg border p-3'>
                              <div>
                                  <p className="font-medium">{proof.label}</p>
                                  {value && <p className="text-sm text-muted-foreground">{value}</p>}
                              </div>
                              <Button variant='outline' onClick={() => handleOpenDialog(proof)}>
                                  {value ? <Edit className="h-4 w-4 md:mr-2" /> : null}
                                  <span className="hidden md:inline">{value ? 'Edit' : 'Add'}</span>
                              </Button>
                          </div>
                      )
                  })}
              </CardContent>
          </Card>
          
          <Card className='mb-4'>
               <CardContent className='p-3'>
                  <div className='flex items-center justify-between'>
                      <p>Face</p>
                      <Button className='bg-blue-600 hover:bg-blue-700 text-white'>Verify</Button>
                  </div>
              </CardContent>
          </Card>

          <Card className='mb-4'>
               <CardContent className='p-3'>
                  <div className='flex items-center justify-between'>
                      <p>Address</p>
                      <Button variant='outline'>Add</Button>
                  </div>
              </CardContent>
          </Card>
          
          <Card>
               <CardContent className='p-3'>
                  <div className='flex items-center justify-between'>
                      <p>Past Employment</p>
                      <Button variant='outline'>Add</Button>
                  </div>
              </CardContent>
          </Card>

        </main>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Add {currentProof?.label}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="proof-value">
                          {currentProof?.label}
                      </Label>
                      <Input
                          id="proof-value"
                          value={proofValue}
                          onChange={(e) => setProofValue(e.target.value)}
                          placeholder={`Enter ${currentProof?.label} number`}
                      />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="outline">
                          Cancel
                      </Button>
                  </DialogClose>
                  <Button onClick={handleSaveProof} disabled={isSaving || !proofValue.trim()}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Save'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
