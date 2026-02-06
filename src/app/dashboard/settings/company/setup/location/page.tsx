'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function AddBranchLocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();

  const branchName = searchParams.get('branchName') || 'New Branch';

  const [location] = useState(
    '190, Sukhdev Vihar, Okhla, New Delhi, Delhi 110...'
  );
  const [radius, setRadius] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available. Please try again.',
      });
      return;
    }
    setIsSaving(true);

    const branchesCol = collection(firestore, 'branches');
    const newBranch = {
      name: branchName,
      address: location,
      radius: radius,
    };

    addDocumentNonBlocking(branchesCol, newBranch);

    toast({
      title: 'Branch Added!',
      description: `The branch "${branchName}" has been successfully added.`,
    });

    setTimeout(() => {
      setIsSaving(false);
      // Navigate to the next setup page
      router.push('/dashboard/settings/company/setup/add-details');
    }, 500);
  };

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
        <h1 className="ml-4 text-lg font-semibold">Setup Attendance Location</h1>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="relative h-64 w-full">
          <Image
            src="https://picsum.photos/seed/mapview/800/400"
            alt="Map View"
            layout="fill"
            objectFit="cover"
            data-ai-hint="map view"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-md bg-white p-2 shadow-lg dark:bg-card">
              <p className="text-sm font-medium">
                Company Location will be set here
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Tell us your company address!
            </h2>
            <p className="text-muted-foreground">& set geofence radius</p>
          </div>

          <div>
            <Label>Company location</Label>
            <div className="mt-1 flex items-center justify-between rounded-md border bg-muted/50 p-3">
              <p className="truncate text-sm">{location}</p>
              <Button variant="link" className="shrink-0 text-primary">
                Change
              </Button>
            </div>
          </div>

          <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
                  Maximum Attendance Radius
                </h3>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Staff can mark attendance within this radius only
              </p>

              <div className="pt-2">
                <Slider
                  value={[radius]}
                  onValueChange={(value) => setRadius(value[0])}
                  min={100}
                  max={1000}
                  step={50}
                />
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>100 m</span>
                  <span>1000 m</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleContinue}
          className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </footer>
    </div>
  );
}
