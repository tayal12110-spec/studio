'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
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

export default function BreaksPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [breakName, setBreakName] = useState('');
  const [breakType, setBreakType] = useState<'unpaid' | 'paid'>('unpaid');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddBreakClick = () => {
    setBreakName('');
    setBreakType('unpaid');
    setIsSaving(false);
    setIsDialogOpen(true);
  };

  const handleAddBreak = () => {
    if (!breakName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Break name is required.',
      });
      return;
    }
    setIsSaving(true);
    // In a real app, this would save the break to the database.
    // For now, we'll just show a toast and close the dialog.
    setTimeout(() => {
      toast({
        title: 'Break Added',
        description: `The "${breakName}" break has been added.`,
      });
      setIsSaving(false);
      setIsDialogOpen(false);
      // In a real implementation, we would see the new break listed on the page.
    }, 500);
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
          <h1 className="ml-4 text-lg font-semibold">Breaks</h1>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">No Company Break</h2>
            <Button
              onClick={handleAddBreakClick}
              className="h-12 bg-accent px-6 text-base text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Break
            </Button>
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold">Add New Break</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-6 px-6 pb-6">
            <div>
              <Label htmlFor="break-name">
                Break Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="break-name"
                value={breakName}
                onChange={(e) => setBreakName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>
                Break Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={breakType}
                onValueChange={(value: 'unpaid' | 'paid') => setBreakType(value)}
                className="grid grid-cols-2 gap-4 mt-1"
              >
                <div>
                  <RadioGroupItem value="unpaid" id="unpaid" className="peer sr-only" />
                  <Label
                    htmlFor="unpaid"
                    className="flex items-center justify-center rounded-md border-2 border-input bg-background p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                  >
                    Unpaid
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="paid" id="paid" className="peer sr-only" />
                  <Label
                    htmlFor="paid"
                    className="flex items-center justify-center rounded-md border-2 border-input bg-background p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                  >
                    Paid
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-4 p-4 border-t">
            <DialogClose asChild>
              <Button variant="outline" className="h-11">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleAddBreak}
              disabled={isSaving || !breakName.trim()}
              className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Break
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
