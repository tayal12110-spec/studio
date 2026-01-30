'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShiftsPage() {
  const router = useRouter();

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
        <h1 className="ml-4 text-lg font-semibold">Shifts</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">No Company Shift</h2>
          <Button className="h-12 bg-accent px-6 text-base text-accent-foreground hover:bg-accent/90">
            <Plus className="mr-2 h-5 w-5" />
            Add Shift
          </Button>
        </div>
      </main>
    </div>
  );
}
