'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import {
  useDoc,
  useFirestore,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Branch } from '../../../../../data';

export default function EditBranchPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params.branchId as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const branchRef = useMemoFirebase(
    () => (firestore && branchId ? doc(firestore, 'branches', branchId) : null),
    [firestore, branchId]
  ) as DocumentReference<Branch> | null;

  const { data: branch, isLoading } = useDoc<Branch>(branchRef);

  const [branchName, setBranchName] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (branch) {
      setBranchName(branch.name);
      setAddress(branch.address);
      setRadius(branch.radius);
    }
  }, [branch]);

  const handleSave = () => {
    if (!branchRef) return;
    setIsSaving(true);

    const updatedData = {
      name: branchName,
      address: address,
      radius: radius,
    };

    updateDocumentNonBlocking(branchRef, updatedData);

    toast({
      title: 'Branch Updated!',
      description: `The branch "${branchName}" has been successfully updated.`,
    });

    setTimeout(() => {
      setIsSaving(false);
      router.push('/dashboard/settings/company/branches');
    }, 500);
  };
  
  if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }
  
  if (!branch && !isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
            <p>Branch not found.</p>
        </div>
      );
  }

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
        <h1 className="ml-4 text-lg font-semibold">Edit Branch</h1>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div>
          <Label htmlFor="branch-name">Branch Name</Label>
          <Input
            id="branch-name"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="branch-address">Branch Address</Label>
          <Input
            id="branch-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Maximum Attendance Radius ({radius}m)</Label>
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
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleSave}
          className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
          disabled={isSaving || !branchName.trim()}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </footer>
    </div>
  );
}
