'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SetupCompanyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('ABC pvt. ltd.');
  const [staffCount, setStaffCount] = useState('');
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = () => {
    if (!companyName.trim() || !staffCount.trim() || !pincode.trim()) {
      toast({
        variant: 'destructive',
        title: 'Please fill all required fields.',
      });
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Company Setup Complete!',
      });
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center bg-card px-4">
        <h1 className="text-xl font-medium w-full">Setup your company account</h1>
      </header>
      <main className="flex-1 p-4 space-y-6">
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700 text-blue-800 dark:text-blue-200">
            <div className="flex items-center justify-between">
                <div>
                    <AlertTitle className="font-bold">Trusted by 10 Lakhs+ businesses</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-300">Best Attendance App</AlertDescription>
                </div>
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
        </Alert>

        <div className="space-y-4">
            <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 bg-white dark:bg-card border-accent focus-visible:ring-accent"
                />
            </div>
             <div>
                <Label htmlFor="staff-count">Staff Count</Label>
                <Input
                    id="staff-count"
                    type="number"
                    placeholder="eg. 15"
                    value={staffCount}
                    onChange={(e) => setStaffCount(e.target.value)}
                    className="mt-1 bg-white dark:bg-card"
                />
            </div>
            <div>
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1 bg-white dark:bg-card">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="it">IT/Software</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div>
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country" className="mt-1 bg-white dark:bg-card">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                    id="pincode"
                    placeholder="eg 121212"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="mt-1 bg-white dark:bg-card"
                />
            </div>
            <div className="flex items-center justify-between pt-4">
                <Label htmlFor="whatsapp-alerts" className="font-normal text-base">Send free Whatsapp alerts</Label>
                <Switch
                    id="whatsapp-alerts"
                    checked={whatsappAlerts}
                    onCheckedChange={setWhatsappAlerts}
                />
            </div>
        </div>
      </main>
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleContinue}
          disabled={isSubmitting}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
           <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </footer>
    </div>
  );
}
