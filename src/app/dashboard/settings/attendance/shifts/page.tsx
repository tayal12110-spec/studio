'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function ShiftsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [shiftName, setShiftName] = useState('');
  const [shiftStartTime, setShiftStartTime] = useState('');
  const [canPunchIn, setCanPunchIn] = useState('anytime');
  const [shiftEndTime, setShiftEndTime] = useState('');
  const [canPunchOut, setCanPunchOut] = useState('anytime');

  const handleAddShift = () => {
    // Basic validation
    if (!shiftName.trim() || !shiftStartTime.trim() || !shiftEndTime.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all required fields.',
      });
      return;
    }

    // Logic to add shift will go here
    console.log({
      shiftName,
      shiftStartTime,
      canPunchIn,
      shiftEndTime,
      canPunchOut,
    });

    toast({
      title: 'Shift Added!',
      description: `The shift "${shiftName}" has been added.`,
    });

    setIsDialogOpen(false);
    // Reset form fields
    setShiftName('');
    setShiftStartTime('');
    setCanPunchIn('anytime');
    setShiftEndTime('');
    setCanPunchOut('anytime');

    // In a real app, you would likely re-fetch shifts and the page would no longer show "No Company Shift"
  };

  return (
    <>
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
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="h-12 bg-accent px-6 text-base text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Shift
            </Button>
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl">Add New Shift</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-6 px-6 pb-6 overflow-y-auto max-h-[70vh]">
            <div>
              <Label htmlFor="shift-name" className="flex items-center">
                Shift Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="shift-name"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                className="mt-1"
                placeholder="e.g. Morning Shift"
              />
            </div>

            <div>
              <Label htmlFor="start-time" className="flex items-center">
                Shift Start Time <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="start-time"
                type="time"
                value={shiftStartTime}
                onChange={(e) => setShiftStartTime(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="flex items-center mb-2">
                Can Punch In <span className="text-red-500 ml-1">*</span>
              </Label>
              <RadioGroup
                value={canPunchIn}
                onValueChange={setCanPunchIn}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="anytime" id="punch-in-anytime" className="peer sr-only" />
                  <Label
                    htmlFor="punch-in-anytime"
                    className="flex items-center justify-center rounded-md border-2 border-input bg-background p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                  >
                    Anytime
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="limit" id="punch-in-limit" className="peer sr-only" />
                  <Label
                    htmlFor="punch-in-limit"
                    className="flex items-center justify-center rounded-md border-2 border-input bg-background p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                  >
                    Add Limit
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="end-time" className="flex items-center">
                Shift End Time <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="end-time"
                type="time"
                value={shiftEndTime}
                onChange={(e) => setShiftEndTime(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="flex items-center mb-2">
                Can Punch Out <span className="text-red-500 ml-1">*</span>
              </Label>
              <RadioGroup
                value={canPunchOut}
                onValueChange={setCanPunchOut}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="anytime" id="punch-out-anytime" className="peer sr-only" />
                  <Label
                    htmlFor="punch-out-anytime"
                    className="flex items-center justify-center rounded-md border-2 border-input bg-background p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                  >
                    Anytime
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="limit" id="punch-out-limit" className="peer sr-only" />
                  <Label
                    htmlFor="punch-out-limit"
                    className="flex items-center justify-center rounded-md border-2 border-input bg-background p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                  >
                    Add Limit
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-4 p-4 border-t">
            <DialogClose asChild>
              <Button variant="outline" className="h-11">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddShift} className="h-11 bg-accent text-accent-foreground hover:bg-accent/90">Add Shift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
