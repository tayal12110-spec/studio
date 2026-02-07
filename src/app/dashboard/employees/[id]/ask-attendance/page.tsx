'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AskAttendancePage() {
  const router = useRouter();

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
        <h1 className="ml-4 text-lg font-semibold">Ask staff to mark attendance</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
         <p className="text-muted-foreground">(Page content temporarily simplified to fix build issues)</p>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <MessageSquare className="mr-2 h-6 w-6" />
          INVITE STAFF NOW
        </Button>
      </footer>
    </div>
  );
}
