'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BiometricDevicesPage() {
  const router = useRouter();

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
            asChild
            className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90"
          >
            <Link href="/dashboard/settings/attendance/biometric-devices/add">
              <Plus className="mr-2 h-5 w-5" />
              Add Biometric
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
