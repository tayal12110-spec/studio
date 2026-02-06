'use client';

import { useState } from 'react';
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

export default function CreateCompanyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = () => {
    if (!companyName.trim() || !phoneNumber.trim()) {
      toast({
        variant: 'destructive',
        title: 'All fields are required',
      });
      return;
    }
    
    // Basic phone number validation
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast({
        variant: 'destructive',
        title: 'Invalid phone number',
        description: 'Please enter a valid 10-digit phone number.',
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsSubmitting(false);
      const fullPhoneNumber = `${countryCode} - ${phoneNumber}`;
      router.push(`/dashboard/settings/company/create/verify?phone=${encodeURIComponent(fullPhoneNumber)}`);
    }, 1000);
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Create Company</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Your Phone Number</Label>
            <div className="flex items-center gap-2 mt-1">
                <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[85px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="+91">+91</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    className="flex-1"
                />
            </div>
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleContinue}
          disabled={isSubmitting || !companyName.trim() || !phoneNumber.trim()}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
        </Button>
      </footer>
    </div>
  );
}
