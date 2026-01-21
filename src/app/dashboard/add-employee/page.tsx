'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Contact, X } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useEmployees } from '../employee-context';
import type { Staff } from '../data';


export default function AddEmployeePage() {
  const [staffName, setStaffName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isInviteDialogOpen, setInviteDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { addEmployee } = useEmployees();

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffName.trim()) {
      setInviteDialogOpen(true);
    }
  };

  const handleInvite = () => {
    const newEmployee: Staff = {
        name: staffName,
        status: 'Inactive',
        avatar: staffName.charAt(0).toUpperCase() || 'N',
    };
    addEmployee(newEmployee);
    setInviteDialogOpen(false);
    toast({
        title: 'Invitation Sent!',
        description: `${staffName} has been invited.`,
    });
    router.push('/dashboard');
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" size="icon" aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-lg font-semibold">Add Employee Details</h1>
        </header>

        <form onSubmit={handleAddEmployee} className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <Alert className="mb-8 border-accent/50 bg-accent/10">
            <AlertDescription className="text-primary">
                Now Add Multiple Staff using Desktop app -{' '}
                <a href="#" className="font-semibold text-primary underline">
                web.salarybox.in
                </a>
            </AlertDescription>
            </Alert>

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
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <div className="mt-1 flex gap-2">
                    <Select defaultValue="+91">
                        <SelectTrigger className="w-[80px]">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="+91">+91</SelectItem>
                        {/* Add other country codes if needed */}
                        </SelectContent>
                    </Select>
                    <Input
                        id="phone-number"
                        type="tel"
                        placeholder="Enter Phone Number"
                        className="flex-1"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    </div>
                </div>

                <div>
                    <Label htmlFor="login-otp">Login OTP</Label>
                    <Input
                    id="login-otp"
                    defaultValue="628115"
                    className="mt-1"
                    readOnly
                    />
                </div>

                <div>
                    <Label htmlFor="permission">Permission</Label>
                    <Select defaultValue="employee">
                    <SelectTrigger id="permission" className="mt-1">
                        <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-center pt-2">
                    <Button variant="ghost" className="text-accent hover:text-accent">
                        <Contact className="mr-2 h-5 w-5" />
                    Add From Contacts
                    </Button>
                </div>
            </div>
          </main>

          <footer className="shrink-0 border-t bg-card p-4">
            <Button
            type="submit"
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={!staffName.trim() || !phoneNumber.trim()}
            >
            Add Employee
            <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </footer>
        </form>
      </div>

      <Dialog open={isInviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-xs p-0 bg-card border-none rounded-lg">
            <div className="relative p-6 pt-10 text-center">
                <div className="absolute top-0 right-0 pt-2 pr-2">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setInviteDialogOpen(false)}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Invite {staffName}</h3>
                    <p className="text-muted-foreground mb-6 text-sm px-4">
                        {staffName} can use SalaryBox to mark their own attendance.
                    </p>
                    <Button onClick={handleInvite} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
                        Invite Staff
                    </Button>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
