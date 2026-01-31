'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function IncentiveTypesPage() {
  const router = useRouter();
  const { toast } = useToast();
  // We'll add state management for incentive types later
  const [incentiveTypes, setIncentiveTypes] = useState<any[]>([]);

  const handleAddIncentiveType = () => {
    // This will open a dialog/sheet in a future step
    toast({
      title: 'Coming Soon!',
      description: 'The ability to add incentive types is under development.',
    });
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
          className="hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Incentive Types</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">No Incentive Types Added</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Add Incentive Types to better categorize your incentives and make it easier to manage.
          </p>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleAddIncentiveType}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Incentive Type
        </Button>
      </footer>
    </div>
  );
}
