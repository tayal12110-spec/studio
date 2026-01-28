'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useDoc,
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { useToast } from '@/hooks/use-toast';

const leaveTypes: { key: 'privileged' | 'sick' | 'casual'; name: string }[] = [
  { key: 'privileged', name: 'Privileged Leave' },
  { key: 'sick', name: 'Sick Leave' },
  { key: 'casual', name: 'Casual Leave' },
];

export default function LeaveBalancesPage() {
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

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const [balances, setBalances] = useState({
    privileged: 0,
    sick: 0,
    casual: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (employee?.leaveBalances) {
      setBalances(employee.leaveBalances);
    }
  }, [employee]);

  const handleBalanceChange = (
    key: 'privileged' | 'sick' | 'casual',
    value: string
  ) => {
    setBalances((prev) => ({
      ...prev,
      [key]: Number(value) || 0,
    }));
  };

  const handleUpdateBalances = () => {
    if (!employeeRef) return;
    setIsSaving(true);
    updateDocumentNonBlocking(employeeRef, { leaveBalances: balances });
    toast({
      title: 'Balances Updated',
      description: `Leave balances for ${employee?.name} have been updated.`,
    });
    setTimeout(() => {
      setIsSaving(false);
      router.back();
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
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
          className="hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">
          {employee?.name} - Leave Balances
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between rounded-md bg-muted/50 px-4 py-2 font-medium text-muted-foreground">
                <span>Leave Type</span>
                <span>Remaining Balance</span>
              </div>
              {leaveTypes.map((leave) => (
                <div
                  key={leave.key}
                  className="flex items-center justify-between px-4"
                >
                  <span className="font-medium">{leave.name}</span>
                  <Input
                    type="number"
                    value={balances[leave.key]}
                    onChange={(e) => handleBalanceChange(leave.key, e.target.value)}
                    className="w-24 text-center"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
        <Button
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleUpdateBalances}
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Updating...' : 'Update Balances'}
        </Button>
      </footer>
    </div>
  );
}
