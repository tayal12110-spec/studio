'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  useDoc,
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function BankDetailsPage() {
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

  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'upi'>('bank');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setAccountHolderName(employee.accountHolderName || '');
      setAccountNumber(employee.accountNumber || '');
      setBankName(employee.bankName || '');
      setIfscCode(employee.ifscCode || '');
      setUpiId(employee.upiId || '');
      if (employee.upiId && !employee.accountNumber) {
        setPaymentMethod('upi');
      }
    }
  }, [employee]);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeRef) {
      setIsSaving(true);
      const updatedData: Partial<Employee> =
        paymentMethod === 'bank'
          ? {
              accountHolderName,
              accountNumber,
              bankName,
              ifscCode,
              upiId: '', // clear UPI if switching to bank
            }
          : {
              upiId,
              accountHolderName: '', // clear bank details if switching to UPI
              accountNumber: '',
              bankName: '',
              ifscCode: '',
            };

      updateDocumentNonBlocking(employeeRef, updatedData);

      toast({
        title: 'Details Saved!',
        description: `${employee?.name}'s bank details have been updated.`,
      });

      setTimeout(() => {
        setIsSaving(false);
        router.push(`/dashboard/employees/${employeeId}`);
      }, 500);
    }
  };

  const isFormValid =
    paymentMethod === 'bank'
      ? accountHolderName.trim() &&
        accountNumber.trim() &&
        bankName.trim() &&
        ifscCode.trim()
      : upiId.trim();

  if (isLoadingEmployee) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.push(`/dashboard/employees/${employeeId}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Edit Employee</h1>
      </header>
       <Tabs defaultValue="bank" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none bg-card">
                <TabsTrigger value="personal" asChild className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Link href={`/dashboard/employees/${employeeId}/edit`}>Personal</Link>
                </TabsTrigger>
                <TabsTrigger value="employment" asChild className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Link href={`/dashboard/employees/${employeeId}/current-employment`}>Employment</Link>
                </TabsTrigger>
                <TabsTrigger value="salary" asChild className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Link href={`/dashboard/employees/${employeeId}/salary-details`}>Salary</Link>
                </TabsTrigger>
                <TabsTrigger value="bank" asChild className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    <Link href={`/dashboard/employees/${employeeId}/bank-details`}>Bank</Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>


      <form onSubmit={handleSaveDetails} className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value: any) => setPaymentMethod(value)}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <Label htmlFor="bank-account" className={`rounded-lg border-2 p-4 flex items-center justify-center cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-accent bg-accent/10 text-accent' : 'border-input'}`}>
                <RadioGroupItem value="bank" id="bank-account" className="mr-3"/>
                <span className="font-medium">Bank Account</span>
            </Label>
            <Label htmlFor="upi" className={`rounded-lg border-2 p-4 flex items-center justify-center cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-accent bg-accent/10 text-accent' : 'border-input'}`}>
                <RadioGroupItem value="upi" id="upi" className="mr-3"/>
                <span className="font-medium">UPI</span>
            </Label>
          </RadioGroup>
          
          {paymentMethod === 'bank' ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="account-holder-name">Account Holder's Name</Label>
                <Input id="account-holder-name" placeholder="Enter Name" className="mt-1" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="account-number">Account Number</Label>
                <Input id="account-number" placeholder="Enter Account Number" className="mt-1" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input id="bank-name" placeholder="Enter Bank Name" className="mt-1" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="ifsc-code">IFSC Code</Label>
                <Input id="ifsc-code" placeholder="Enter IFSC Code" className="mt-1" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required />
              </div>
            </div>
          ) : (
             <div>
                <Label htmlFor="upi-id">Staff UPI ID</Label>
                <Input id="upi-id" placeholder="Enter UPI ID" className="mt-1" value={upiId} onChange={(e) => setUpiId(e.target.value)} required />
              </div>
          )}
          
        </main>

        <footer className="shrink-0 border-t bg-card p-4">
          <Button
            type="submit"
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={!isFormValid || isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Details'}
          </Button>
        </footer>
      </form>
    </div>
  );
}
