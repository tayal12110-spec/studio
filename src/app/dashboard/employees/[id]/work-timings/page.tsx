'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function WorkTimingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [workType, setWorkType] = useState<'fixed' | 'flexible' | undefined>();

  const handleUpdate = () => {
    // Logic to save the work timings would go here
    toast({
      title: 'Details Updated',
      description: 'Work timings have been saved.',
    });
    router.back();
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Work Timings</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <RadioGroup
              onValueChange={(value: 'fixed' | 'flexible') => setWorkType(value)}
              value={workType}
              className="flex items-center space-x-6"
            >
              <Label className="flex-1 text-base font-medium">Select Type</Label>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="font-normal">Fixed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible" className="font-normal">Flexible</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="text-center text-muted-foreground">
            <p>Select type to set Work Timings</p>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
        <Button onClick={handleUpdate} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90" disabled={!workType}>
          Update Details
        </Button>
      </footer>
    </div>
  );
}
