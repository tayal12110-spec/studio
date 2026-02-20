'use client';

import { useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../../data';
import { format, parse, isValid } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

function AddAdvancePageComponent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const employeeId = params.id as string;
  const monthStr = searchParams.get('month');
  
  const month = monthStr && isValid(parse(monthStr, 'yyyy-MM', new Date())) 
    ? parse(monthStr, 'yyyy-MM', new Date()) 
    : new Date();

  const firestore = useFirestore();
  
  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } = useDoc<Employee>(employeeRef);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isKycDialogOpen, setIsKycDialogOpen] = useState(false);

  const handlePay = () => {
    if (!amount) {
        toast({
            variant: "destructive",
            title: "Amount is required",
            description: "Please enter an amount to pay.",
        });
        return;
    }
    
    setIsSaving(true);
    // Here you would typically process the payment and save the record
    
    toast({
        title: "Advance Paid!",
        description: `An advance of ₹${amount} has been recorded for ${employee?.name}.`,
    });

    setTimeout(() => {
        setIsSaving(false);
        router.back();
    }, 500);
  };
  
  const handlePayOnlineClick = () => {
    if (!amount) {
      toast({
        variant: 'destructive',
        title: 'Amount is required',
        description: 'Please enter an amount to pay.',
      });
      return;
    }
    setIsKycDialogOpen(true);
  };

  const handleKycVerification = () => {
    setIsKycDialogOpen(false);
    toast({
      title: 'Coming Soon!',
      description: 'KYC Verification feature is under development.',
    });
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
      <div className="flex h-full flex-col bg-background">
        <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Paying Advance to {employee?.name}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-muted-foreground">Pay Advance: {format(month, 'MMM yyyy')}</h2>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter Amount"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="note">Add Note</Label>
              <Textarea
                id="note"
                placeholder="Enter note here"
                className="mt-1"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </main>

        <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4 space-y-3">
          <Button
              onClick={handlePayOnlineClick}
              className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isSaving || !amount}
          >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pay Online
          </Button>
          <Button
              onClick={handlePay}
              variant="ghost"
              className="w-full h-12 text-base text-accent"
              disabled={isSaving || !amount}
          >
              I have already paid
          </Button>
        </footer>
      </div>

      <Dialog open={isKycDialogOpen} onOpenChange={setIsKycDialogOpen}>
        <DialogContent className="sm:max-w-xs text-center p-0 gap-0">
          <DialogHeader className="p-6">
            <DialogTitle className="text-center text-xl font-bold">
              Pay Online?
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-base">
              Now you can pay your staff directly to their bank account. Get Access Now.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-2 flex flex-col gap-3">
            <Button
              onClick={handleKycVerification}
              className="h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Do KYC Verification
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="h-auto">
                No, I want to pay offline
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AddAdvancePage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <AddAdvancePageComponent />
    </Suspense>
  );
}
