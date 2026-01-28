'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';

const leaveTypes = [
  { name: 'Privileged Leave', balance: 0 },
  { name: 'Sick Leave', balance: 0 },
  { name: 'Casual Leave', balance: 0 },
];

export default function LeaveBalancesPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
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
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">{employee?.name} - Leave Balances</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between rounded-md bg-muted/50 px-4 py-2 font-medium text-muted-foreground">
                <span>Leave Type</span>
                <span>Remaining Balance</span>
              </div>
              {leaveTypes.map((leave) => (
                <div key={leave.name} className="flex items-center justify-between px-4 py-2">
                  <span className="font-medium">{leave.name}</span>
                  <span className="font-semibold">{leave.balance}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
          <Button className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
            Edit Leave balance
          </Button>
      </footer>
    </div>
  );
}
