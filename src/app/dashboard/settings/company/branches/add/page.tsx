'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AddBranchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [branchName, setBranchName] = useState('');

  const handleContinue = () => {
    if (!branchName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Branch name is required',
      });
      return;
    }

    router.push(
      `/dashboard/settings/company/branches/add/location?branchName=${encodeURIComponent(
        branchName
      )}`
    );
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
        <h1 className="ml-4 text-lg font-semibold">Add Branch</h1>
      </header>

      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">Add New Branch</h2>
        <div className="space-y-2">
          <Label htmlFor="branch-name">Branch Name</Label>
          <Input
            id="branch-name"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="Enter branch name"
          />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleContinue}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={!branchName.trim()}
        >
          Continue
        </Button>
      </footer>
    </div>
  );
}
