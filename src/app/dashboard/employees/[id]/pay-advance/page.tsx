'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format, parse, isValid } from 'date-fns';
import Link from 'next/link';

export default function PayAdvancePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const monthStr = searchParams.get('month');
  const employeeId = params.id;
  
  const month = monthStr && isValid(parse(monthStr, 'yyyy-MM', new Date())) 
    ? parse(monthStr, 'yyyy-MM', new Date()) 
    : new Date();

  const noAdvanceImage = PlaceHolderImages.find(img => img.id === 'no-advance');

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
        <h1 className="ml-4 text-lg font-semibold">{format(month, 'MMMM')} Transactions</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="space-y-6 flex flex-col items-center">
          {noAdvanceImage && (
            <Image
              src={noAdvanceImage.imageUrl}
              alt={noAdvanceImage.description}
              width={250}
              height={250}
              className="mx-auto opacity-70"
              data-ai-hint={noAdvanceImage.imageHint}
            />
          )}
          <h2 className="text-xl font-semibold">No Advance Added</h2>
          <Button asChild className="h-12 px-6 text-base bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href={`/dashboard/employees/${employeeId}/pay-advance/add?month=${monthStr || ''}`}>
                <Plus className="mr-2 h-5 w-5" /> Pay Advance
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
