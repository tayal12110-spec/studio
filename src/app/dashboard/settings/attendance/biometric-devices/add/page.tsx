'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, QrCode, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AddBiometricDevicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddDevice = () => {
    if (!name.trim() || !serialNumber.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please enter both a name and a serial number.',
      });
      return;
    }
    setIsSaving(true);
    // Simulate saving the device
    setTimeout(() => {
      toast({
        title: 'Device Added',
        description: `Biometric device "${name}" has been added.`,
      });
      setIsSaving(false);
      router.back();
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
        <h1 className="ml-4 text-lg font-semibold">Add Biometric</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative">
            <Label htmlFor="serial-number" className="sr-only">
              Serial Number
            </Label>
            <Input
              id="serial-number"
              placeholder="Serial Number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="pr-10"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground">
              <QrCode className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleAddDevice}
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Device
        </Button>
      </footer>
    </div>
  );
}
