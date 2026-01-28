'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const LeaveTypeCard = ({
  title,
  cycle,
}: {
  title: string;
  cycle: 'monthly' | 'yearly';
}) => (
  <Card className="p-4 space-y-4 bg-white dark:bg-card">
    <h3 className="font-semibold">{title}</h3>
    <div className="space-y-2">
      <Label className="text-muted-foreground">Allowed Leaves *</Label>
      <div className="relative">
        <Input type="number" className="pr-24" />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 bg-muted rounded-r-md text-muted-foreground text-sm">
          per {cycle === 'monthly' ? 'month' : 'year'}
        </div>
      </div>
    </div>
    <div className="space-y-2">
      <Label className="text-muted-foreground">Carry Forward Leaves *</Label>
      <div className="relative">
        <Input type="number" className="pr-28" />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 bg-muted rounded-r-md text-muted-foreground text-sm">
          on {cycle === 'monthly' ? 'month' : 'year'} end
        </div>
      </div>
    </div>
  </Card>
);

export default function LeavePolicyPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const [leaveCycle, setLeaveCycle] = useState<'monthly' | 'yearly' | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isCustomTypeDialogOpen, setIsCustomTypeDialogOpen] = useState(false);
  const [customLeaveName, setCustomLeaveName] = useState('');
  const [customLeaveTypes, setCustomLeaveTypes] = useState<string[]>([]);

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId
        ? doc(firestore, 'employees', employeeId)
        : null,
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
  
  const handleSaveCustomLeave = () => {
    if (customLeaveName.trim()) {
      setCustomLeaveTypes(prev => [...prev, customLeaveName]);
      toast({
        title: 'Custom Leave Added',
        description: `"${customLeaveName}" has been added.`,
      });
      setCustomLeaveName('');
      setIsCustomTypeDialogOpen(false);
    }
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

        <main className="flex flex-1 flex-col p-4 md:p-6 overflow-y-auto">
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

          {leaveCycle ? (
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Leave Type</h2>
                <Button variant="link" className="text-primary" onClick={() => setIsCustomTypeDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Custom type
                </Button>
              </div>
              <LeaveTypeCard title="Privileged Leave" cycle={leaveCycle} />
              <LeaveTypeCard title="Sick Leave" cycle={leaveCycle} />
              <LeaveTypeCard title="Casual Leave" cycle={leaveCycle} />
              {customLeaveTypes.map(leaveName => (
                  <LeaveTypeCard key={leaveName} title={leaveName} cycle={leaveCycle} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-muted-foreground">
                Select Leave Cycle to set Leave Policy
              </p>
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

      <Dialog open={isCustomTypeDialogOpen} onOpenChange={setIsCustomTypeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Paid Leave</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="custom-leave-name">Custom Leave Name *</Label>
            <Input
              id="custom-leave-name"
              value={customLeaveName}
              onChange={(e) => setCustomLeaveName(e.target.value)}
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSaveCustomLeave} disabled={!customLeaveName.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
