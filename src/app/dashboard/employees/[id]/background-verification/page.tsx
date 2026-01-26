'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const idProofs = ['Aadhaar', 'PAN', 'Driving License', 'Voter ID', 'UAN'];
const otherVerifications = ['Face', 'Address', 'Past Employment'];

export default function BackgroundVerificationPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId
        ? doc(firestore, 'employees', employeeId)
        : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
                {idProofs.map(proof => (
                    <div key={proof} className='flex items-center justify-between rounded-lg border p-3'>
                        <p>{proof}</p>
                        <Button variant='outline'>Add</Button>
                    </div>
                ))}
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
  );
}
