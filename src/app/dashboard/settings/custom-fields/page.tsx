'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomFieldsPage() {
  const router = useRouter();

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
        <h1 className="ml-4 text-lg font-semibold">Custom Fields</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">No Custom Fields Added</h2>
          <p className="text-muted-foreground">
            Create custom fields to store your staff's details,
            <br />
            For Example: Laptop S.No., Badge Number, etc.
          </p>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
            <Plus className="mr-2 h-5 w-5" />
            Add Custom Field
        </Button>
      </footer>
    </div>
  );
}
