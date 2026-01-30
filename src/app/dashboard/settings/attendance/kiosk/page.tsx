'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ManageKioskPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateKiosk = () => {
    toast({
      title: 'Feature coming soon!',
      description: 'The ability to create attendance kiosks is under development.',
    });
  };
  
  const handleHowToUse = () => {
     toast({
      title: 'Feature coming soon!',
      description: 'The tutorial video is not yet available.',
    });
  }

  const kioskImage = PlaceHolderImages.find((img) => img.id === 'kiosk-illustration');

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
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
            <p className="text-lg text-muted-foreground">Tap to add Attendance Kiosk</p>
        </div>
      </main>
      
      <footer className="sticky bottom-0 space-y-3 border-t bg-card p-4">
        <Button variant="outline" className="w-full h-12 text-base" onClick={handleHowToUse}>
            <Youtube className="mr-2 h-5 w-5 text-red-500" />
            How to use Attendance Kiosk
        </Button>
        <Button onClick={handleCreateKiosk} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
            Create Attendance Kiosk
        </Button>
      </footer>

    </div>
  );
}
