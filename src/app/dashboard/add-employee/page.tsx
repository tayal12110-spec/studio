'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useEmployees } from '../employee-context';
import type { Employee } from '../data';

export default function AddEmployeePage() {
  const [staffName, setStaffName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<'Engineering' | 'HR' | 'Marketing' | 'Sales'>('Sales');
  const [baseSalary, setBaseSalary] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { addEmployee } = useEmployees();

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const newEmployee: Omit<Employee, 'id'> = {
      employeeId: `E-${Date.now().toString().slice(-5)}`,
      name: staffName,
      email,
      phoneNumber,
      department,
      baseSalary: Number(baseSalary),
      status: 'Active',
      avatar: staffName.charAt(0).toUpperCase() || 'N',
      permission: 'Employee',
    };
    addEmployee(newEmployee);
    toast({
      title: 'Employee Added!',
      description: `${staffName} has been added to the system.`,
    });

    setTimeout(() => {
      setIsSaving(false);
      router.push('/dashboard/employees');
    }, 500);
  };

  const isFormValid = staffName.trim() && phoneNumber.trim() && email.trim() && baseSalary.trim();

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Link href="/dashboard/employees" passHref>
          <Button variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="ml-4 text-lg font-semibold">Add Employee Details</h1>
      </header>

      <form
        onSubmit={handleAddEmployee}
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
              <Select onValueChange={(value: any) => setDepartment(value)} defaultValue={department}>
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
              <Label htmlFor="base-salary">Base Salary (INR)</Label>
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
          </div>
        </main>

        <footer className="shrink-0 border-t bg-card p-4">
          <Button
            type="submit"
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={!isFormValid || isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Adding...' : 'Add Employee'}
          </Button>
        </footer>
      </form>
    </div>
  );
}
