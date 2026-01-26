'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Loader2, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useDoc,
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

export default function CustomDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const employeeRef = useMemoFirebase(
    () =>
      firestore && employeeId
        ? doc(firestore, 'employees', employeeId)
        : null,
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } = useDoc<Employee>(employeeRef);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentFieldKey, setCurrentFieldKey] = useState<string | null>(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  const customFields = employee?.customFields || {};
  const customFieldKeys = Object.keys(customFields);

  const handleAddFieldClick = () => {
    setCurrentFieldKey(null);
    setFieldName('');
    setFieldValue('');
    setIsDialogOpen(true);
  };

  const handleEditFieldClick = (key: string) => {
    setCurrentFieldKey(key);
    setFieldName(key);
    setFieldValue(customFields[key]);
    setIsDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!fieldName.trim() || !employeeRef) return;
    setIsSaving(true);

    const newCustomFields = { ...customFields };

    if (currentFieldKey && currentFieldKey !== fieldName) {
      delete newCustomFields[currentFieldKey];
    }
    
    newCustomFields[fieldName] = fieldValue;

    updateDocumentNonBlocking(employeeRef, { customFields: newCustomFields });

    toast({
      title: 'Custom Field Saved!',
      description: `The field "${fieldName}" has been saved.`,
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsDialogOpen(false);
    }, 500);
  };

  const handleDeleteField = (keyToDelete: string) => {
      if (!employeeRef) return;

      const newCustomFields = { ...customFields };
      delete newCustomFields[keyToDelete];

      updateDocumentNonBlocking(employeeRef, { customFields: newCustomFields });
      
      toast({
        variant: "destructive",
        title: 'Custom Field Deleted',
        description: `The field "${keyToDelete}" has been deleted.`,
      });
  }

  const renderContent = () => {
    if (isLoadingEmployee) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (customFieldKeys.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">No Custom Fields Added</h2>
            <p className="text-muted-foreground">
              Create custom fields to store your staff's details,
              <br />
              For Example: Laptop S.No., Badge Number, etc.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="p-4 space-y-3">
        {customFieldKeys.map(key => (
          <Card key={key}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">{key}</p>
                <p className="font-semibold">{customFields[key]}</p>
              </div>
              <div className="flex gap-0">
                <Button variant="ghost" size="icon" onClick={() => handleEditFieldClick(key)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteField(key)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };


  return (
    <>
      <div className="flex h-full flex-col">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Custom Fields</h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        
        <footer className="shrink-0 border-t bg-card p-4">
          <Button onClick={handleAddFieldClick} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
              <Plus className="mr-2 h-5 w-5" />
              Add Custom Field
          </Button>
        </footer>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentFieldKey ? 'Edit Custom Field' : 'Add Custom Field'}</DialogTitle>
            <DialogDescription>
              {currentFieldKey ? `Editing the "${currentFieldKey}" field.` : "Add a new piece of information for this employee."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">
                Field Name
              </Label>
              <Input
                id="field-name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g. Laptop Serial Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-value">
                Field Value
              </Label>
              <Input
                id="field-value"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                placeholder="e.g. 123-ABC-456"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    Cancel
                </Button>
            </DialogClose>
            <Button onClick={handleSaveField} disabled={isSaving || !fieldName.trim() || !fieldValue.trim()}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Field'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
