'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MoreVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type BiometricDevice = {
  name: string;
  serialNumber: string;
};

const DeviceItem = ({ device }: { device: BiometricDevice }) => (
  <Card>
    <CardContent className="flex items-center justify-between p-4">
      <div>
        <p className="font-semibold">{device.name}</p>
        <p className="text-sm text-muted-foreground">{device.serialNumber}</p>
      </div>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </CardContent>
  </Card>
);

export default function BiometricDevicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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
    
    const newDevice: BiometricDevice = {
        name,
        serialNumber
    };

    setTimeout(() => {
      setDevices(prev => [...prev, newDevice]);
      setIsSaving(false);
      setIsSheetOpen(false);
      toast({
        title: 'Device Added',
        description: `Biometric device "${name}" has been added.`,
      });
    }, 1000);
  };

  const openSheet = () => {
    setName('');
    setSerialNumber('');
    setIsSaving(false);
    setIsSheetOpen(true);
  };
  
  return (
    <>
      <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Biometric Devices</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24">
            {devices.length === 0 ? (
                <div className="flex h-full flex-1 flex-col items-center justify-center p-6">
                    <p className="text-lg text-muted-foreground">No Biometric Device Added</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {devices.map((device, index) => (
                        <DeviceItem key={index} device={device} />
                    ))}
                </div>
            )}
        </main>
        
        <div className="fixed bottom-24 right-6 z-10 md:bottom-6">
          <Button
            onClick={openSheet}
            className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Biometric
          </Button>
        </div>
      </div>
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md"
        >
          <SheetHeader className="p-6 pb-2 text-center">
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
            <SheetTitle>Add Biometric</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-6 py-4">
             <div>
                <Label htmlFor="name">Name</Label>
                <Input
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                />
            </div>
            <div>
                <Label htmlFor="serial-number">Serial Number</Label>
                <Input
                id="serial-number"
                placeholder="Serial Number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="mt-1"
                />
            </div>
          </div>
          <SheetFooter className="p-6 pt-2">
            <Button
              onClick={handleAddDevice}
              disabled={isSaving || !name.trim() || !serialNumber.trim()}
              className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Device
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
