'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
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

export default function CompanyDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [companyName, setCompanyName] = useState('tut');
  const [businessType, setBusinessType] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [udyamNumber, setUdyamNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Logic to save company details would go here
    toast({
      title: 'Details Saved',
      description: 'Company details have been updated.',
    });
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 500);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Company Details</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed bg-muted">
              <span className="text-muted-foreground">ADD LOGO</span>
              <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Plus className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="business-type">Business Type</Label>
              <Select onValueChange={setBusinessType} value={businessType}>
                <SelectTrigger id="business-type" className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proprietorship">Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="llp">LLP</SelectItem>
                  <SelectItem value="pvt-ltd">Private Limited</SelectItem>
                  <SelectItem value="public-ltd">Public Limited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="company-address">Company Address</Label>
              <Input
                id="company-address"
                placeholder="Company Address"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gst-number">GST Number</Label>
              <Input
                id="gst-number"
                placeholder="GST Number"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="udyam-number">Udyam Registration Number</Label>
              <Input
                id="udyam-number"
                placeholder="Udyam Registration Number"
                value={udyamNumber}
                onChange={(e) => setUdyamNumber(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 grid grid-cols-2 gap-4 border-t bg-card p-4">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-accent text-accent-foreground hover:bg-accent/90">
          Save
        </Button>
      </footer>
    </div>
  );
}
