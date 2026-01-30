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
import { useToast } from '@/hooks/use-toast';

export default function CustomFieldsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    if (!fieldName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Field name is required',
      });
      return;
    }
    setIsSaving(true);
    // In a real app, this would save the custom field definition.
    // For now, we'll just show a toast and close the dialog.
    setTimeout(() => {
      toast({
        title: 'Custom Field Added',
        description: `The field "${fieldName}" has been added.`,
      });
      setIsSaving(false);
      setIsDialogOpen(false);
      setFieldName('');
      // In a subsequent step, we can display the list of added fields.
    }, 500);
  };

  return (
    <>
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
          <h1 className="ml-4 text-lg font-semibold">Custom Fields</h1>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">No Custom Fields Added</h2>
            <p className="text-muted-foreground">
              Create custom fields to store your staff's details,
              <br />
              For Example: Laptop S.No., Badge Number, etc.
            </p>
          </div>
        </main>

        <footer className="sticky bottom-0 border-t bg-card p-4">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Custom Field
          </Button>
        </footer>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-sm p-0">
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
            <DialogTitle className="text-lg font-semibold">
              Add Custom Field
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="p-6">
            <Label htmlFor="field-name">Custom Field Name</Label>
            <Input
              id="field-name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="eg. Laptop Serial No"
              className="mt-1"
            />
          </div>
          <DialogFooter className="grid grid-cols-2 gap-4 p-4 pt-0">
            <DialogClose asChild>
              <Button variant="outline" className="h-11">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleAdd}
              disabled={isSaving || !fieldName.trim()}
              className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
