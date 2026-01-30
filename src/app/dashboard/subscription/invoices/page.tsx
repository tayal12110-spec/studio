'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function InvoiceHistoryPage() {
  const router = useRouter();
  const noInvoicesImage = PlaceHolderImages.find(img => img.id === 'no-invoices');

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center">
            <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
            >
            <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-lg font-semibold">Invoice History</h1>
        </div>
        <Button variant="outline">
          <HelpCircle className="mr-2 h-4 w-4" /> Help
        </Button>
      </header>
      <main className="flex flex-1 flex-col p-4">
        <Alert className="border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-200">
            <AlertDescription>
                If you purchased a plan through the Apple App Store or Google Play Store, your invoice will be available directly from that store.
            </AlertDescription>
        </Alert>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
            {noInvoicesImage && (
                <Image
                src={noInvoicesImage.imageUrl}
                alt={noInvoicesImage.description}
                width={200}
                height={200}
                className="opacity-70"
                data-ai-hint={noInvoicesImage.imageHint}
                />
            )}
            <h2 className="mt-6 text-xl font-semibold">No Invoices Found</h2>
            <p className="mt-2 text-muted-foreground">Your Invoices will be available here.</p>
        </div>
      </main>
    </div>
  );
}
