'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DeviceVerificationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

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
        <h1 className="ml-4 text-lg font-semibold">Device Verification Requests</h1>
      </header>
      <main className="flex flex-1 flex-col">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search employee"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">No pending Device verification requests</h2>
            <p className="text-muted-foreground">
              device verification requests from employees appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
