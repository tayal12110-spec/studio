'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Youtube, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ManageKioskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [kioskName, setKioskName] = useState('Attendance Kiosk');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateKiosk = () => {
    setIsSheetOpen(true);
  };

  const handleAddKiosk = () => {
    if (!kioskName.trim() || !phoneNumber.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide both a name and a phone number.',
      });
      return;
    }
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setIsSheetOpen(false);
      toast({
        title: 'Kiosk Added',
        description: `"${kioskName}" has been added.`,
      });
    }, 1000);
  };

  const handleHowToUse = () => {
    toast({
      title: 'Feature coming soon!',
      description: 'The tutorial video is not yet available.',
    });
  };

  const kioskImage = PlaceHolderImages.find(
    (img) => img.id === 'kiosk-illustration'
  );

  return (
    <>
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
          <h1 className="ml-4 text-lg font-semibold">Manage Attendance Kiosk</h1>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="space-y-4">
            {kioskImage && (
              <Image
                src={kioskImage.imageUrl}
                alt={kioskImage.description}
                width={250}
                height={200}
                data-ai-hint={kioskImage.imageHint}
              />
            )}
            <p className="text-lg text-muted-foreground">
              Tap to add Attendance Kiosk
            </p>
          </div>
        </main>

        <footer className="sticky bottom-0 space-y-3 border-t bg-card p-4">
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleHowToUse}
          >
            <Youtube className="mr-2 h-5 w-5 text-red-500" />
            How to use Attendance Kiosk
          </Button>
          <Button
            onClick={handleCreateKiosk}
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Create Attendance Kiosk
          </Button>
        </footer>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md"
        >
          <SheetHeader className="p-6 pb-2 text-center">
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
            <SheetTitle>Add Attendance Kiosk</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-6 py-4">
            <div>
              <Label htmlFor="kiosk-name">Name</Label>
              <Input
                id="kiosk-name"
                value={kioskName}
                onChange={(e) => setKioskName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="sr-only">
                Phone Number
              </Label>
              <div className="flex items-center gap-2">
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
          <SheetFooter className="p-6 pt-2">
            <Button
              onClick={handleAddKiosk}
              disabled={isSaving || !kioskName.trim() || !phoneNumber.trim()}
              className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Attendance Kiosk
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}