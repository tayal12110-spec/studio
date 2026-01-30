'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function BiometricDevicesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddClick = () => {
    toast({
      title: 'Coming Soon!',
      description: 'Functionality to add biometric devices will be available soon.',
    });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
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
      <main className="flex h-full flex-1 flex-col justify-between p-6">
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-muted-foreground">No Biometric Device Added</p>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleAddClick}
            className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Biometric
          </Button>
        </div>
      </main>
    </div>
  );
}
