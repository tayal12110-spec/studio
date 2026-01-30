'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CharteredAccountantsPage() {
  const router = useRouter();

  const handleAddAccountant = () => {
    // For now, let's just log a message. The next step would be to implement the add functionality.
    console.log('Add Chartered Accountant clicked');
  };

  return (
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
        <h1 className="ml-4 text-lg font-semibold">Add Chartered Accountant</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">No Chartered Accountants Found</h2>
          <p className="text-muted-foreground">
            You can add multiple chartered accountants
          </p>
        </div>
      </main>

      <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
          <Button onClick={handleAddAccountant} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Chartered Accountant
          </Button>
      </footer>
    </div>
  );
}
