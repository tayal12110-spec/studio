'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AttendanceCyclePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [startDay, setStartDay] = useState('1');
  const [isSaving, setIsSaving] = useState(false);

  const endDay = startDay === '1' ? 'End of Month' : (parseInt(startDay, 10) - 1).toString();

  const handleSave = () => {
    setIsSaving(true);
    // In a real app, you'd save this setting
    toast({
      title: 'Settings Saved',
      description: 'Attendance cycle has been updated.',
    });
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 500);
  };

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
        <h1 className="ml-4 text-lg font-semibold">Attendance Cycle</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-day">Start Day</Label>
              <Select value={startDay} onValueChange={setStartDay}>
                <SelectTrigger id="start-day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-day">End Day</Label>
              <Input id="end-day" value={endDay} disabled />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            eg. If your cycle is variable i.e from 15th to 14th etc, use this setting.
          </p>
        </div>
      </main>
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-xs p-0">
              <AlertDialogHeader className="text-center p-6">
                  <AlertDialogTitle className="text-xl font-bold">Your Cycle will be updated!!</AlertDialogTitle>
                  <AlertDialogDescription className="pt-2 text-base">
                      e.g. Salary of Feb Month will be calculated based on attendance of 1 Jan to end of Jan
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col gap-2 p-6 pt-2">
                  <AlertDialogAction onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-11">
                      Confirm
                  </AlertDialogAction>
                  <AlertDialogCancel asChild>
                    <Button variant="ghost" className="w-full h-11">Cancel</Button>
                  </AlertDialogCancel>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </footer>
    </div>
  );
}
