'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  
  const firestore = useFirestore();
  const { toast } = useToast();

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } = useDoc<Employee>(employeeRef);

  const [staffName, setStaffName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<'Engineering' | 'HR' | 'Marketing' | 'Sales'>('Sales');
  const [baseSalary, setBaseSalary] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Terminated' | 'Inactive'>('Active');
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setStaffName(employee.name);
      setPhoneNumber(employee.phoneNumber || '');
      setEmail(employee.email);
      setDepartment(employee.department);
      setBaseSalary(String(employee.baseSalary));
      setStatus(employee.status);
    }
  }, [employee]);

  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeRef) {
      setIsSaving(true);
      const updatedData = {
        name: staffName,
        email,
        phoneNumber,
        department,
        baseSalary: Number(baseSalary),
        status,
      };
      
      updateDocumentNonBlocking(employeeRef, updatedData);
      
      toast({
        title: 'Employee Updated!',
        description: `${staffName}'s details have been updated.`,
      });
      
      setTimeout(() => {
        setIsSaving(false);
        router.push(`/dashboard/employees/${employeeId}`);
      }, 500);
    }
  };

  const isFormValid = staffName.trim() && phoneNumber.trim() && email.trim() && baseSalary.trim();

  if (isLoadingEmployee) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!employee) {
    return <div className="p-4 text-center">Employee not found.</div>;
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Edit Employee Details</h1>
        </header>

        <form
          onSubmit={handleUpdateEmployee}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="staff-name">Staff Name</Label>
                <Input
                  id="staff-name"
                  placeholder="Enter Name"
                  className="mt-1"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="mt-1"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value: any) => setDepartment(value)} value={department}>
                  <SelectTrigger id="department" className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="base-salary">Base Salary (USD)</Label>
                <Input
                  id="base-salary"
                  type="number"
                  placeholder="Enter Base Salary"
                  className="mt-1"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value: any) => setStatus(value)} value={status}>
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </main>

          <footer className="shrink-0 border-t bg-card p-4">
            <Button
              type="submit"
              className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={!isFormValid || isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </footer>
        </form>
      </div>
    </>
  );
}
