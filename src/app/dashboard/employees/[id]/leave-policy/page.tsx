'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function LeavePolicyPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const [leaveCycle, setLeaveCycle] = useState<'monthly' | 'yearly' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const handleUpdatePolicy = () => {
    if (!leaveCycle) {
      toast({
        variant: 'destructive',
        title: 'No cycle selected',
        description: 'Please select a leave cycle before updating.',
      });
      return;
    }
    // Logic to save the policy will go here
    setIsSaving(true);
    toast({
      title: 'Policy Updated',
      description: `Leave policy has been set to ${leaveCycle}.`,
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
          {employee?.name} - Leave Policy
        </h1>
      </header>

      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Leave Cycle</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={leaveCycle === 'monthly' ? 'default' : 'outline'}
              onClick={() => setLeaveCycle('monthly')}
              className={cn(
                'py-6 text-base',
                leaveCycle === 'monthly'
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'bg-card'
              )}
            >
              Monthly
            </Button>
            <Button
              variant={leaveCycle === 'yearly' ? 'default' : 'outline'}
              onClick={() => setLeaveCycle('yearly')}
              className={cn(
                'py-6 text-base',
                leaveCycle === 'yearly'
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'bg-card'
              )}
            >
              Yearly
            </Button>
          </div>
        </div>
        
        {!leaveCycle && (
            <div className="flex-1 flex items-center justify-center text-center">
                <p className="text-muted-foreground">Select Leave Cycle to set Leave Policy</p>
            </div>
        )}
      </main>

      <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
        <Button
          className="w-full h-12 text-base"
          onClick={handleUpdatePolicy}
          disabled={isSaving || !leaveCycle}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Updating...' : 'Update Policy'}
        </Button>
      </footer>
    </div>
  );
}
