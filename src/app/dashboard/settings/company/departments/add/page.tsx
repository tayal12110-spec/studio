
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function AddDepartmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [departmentName, setDepartmentName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!departmentName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Department name is required',
      });
      return;
    }
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available. Please try again.',
      });
      return;
    }
    setIsSaving(true);

    const departmentsCol = collection(firestore, 'departments');
    addDocumentNonBlocking(departmentsCol, { name: departmentName });

    toast({
      title: 'Department Added!',
      description: `The department "${departmentName}" has been successfully added.`,
    });

    setTimeout(() => {
      setIsSaving(false);
      router.push('/dashboard/settings/company/departments');
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
        <h1 className="ml-4 text-lg font-semibold">Add Department</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="space-y-2">
          <Label htmlFor="department-name">Department Name</Label>
          <Input
            id="department-name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Enter department name"
          />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleSave}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={isSaving || !departmentName.trim()}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Department'}
        </Button>
      </footer>
    </div>
  );
}
