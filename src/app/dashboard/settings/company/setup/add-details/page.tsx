'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
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

export default function AddDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [features, setFeatures] = useState('');
  const [heardFrom, setHeardFrom] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = () => {
    if (!name.trim() || !role || !email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Please fill all required fields',
      });
      return;
    }
    setIsSubmitting(true);
    // Simulate saving data
    setTimeout(() => {
      toast({
        title: 'Details Saved!',
      });
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 1000);
  };

  const isFormValid = name.trim() && role && email.trim();

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <h1 className="text-lg font-semibold">Add your details</h1>
      </header>
      <main className="flex-1 space-y-6 p-6">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role" className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="hr-admin">HR/Admin</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="eg. example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="features">Features you are interested in (Optional)</Label>
          <Select value={features} onValueChange={setFeatures}>
            <SelectTrigger id="features" className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="reporting">Reporting</SelectItem>
            </SelectContent>
          </Select>
        </div>
         <div>
          <Label htmlFor="heard-from">How did you hear about us (Optional)</Label>
          <Select value={heardFrom} onValueChange={setHeardFrom}>
            <SelectTrigger id="heard-from" className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
         <div>
          <Label htmlFor="salary-paid">How much salary do you pay monthly (Optional)</Label>
          <Select value={salary} onValueChange={setSalary}>
            <SelectTrigger id="salary-paid" className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<10k">&lt; 10,000</SelectItem>
              <SelectItem value="10k-50k">10,000 - 50,000</SelectItem>
              <SelectItem value="50k-1L">50,000 - 1,00,000</SelectItem>
              <SelectItem value=">1L">&gt; 1,00,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </main>
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleContinue}
          disabled={!isFormValid || isSubmitting}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </footer>
    </div>
  );
}
