'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  // Placeholder for future functionality
  const handleAddCustomField = () => {
    // TODO: Implement logic to add a custom field
    console.log('Add custom field for employee:', employeeId);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Custom Details</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">No Custom Fields Added</h2>
          <p className="text-muted-foreground">
            Create custom fields to store your staff's details,
            <br />
            For Example: Laptop S.No., Badge Number, etc.
          </p>
          <Button variant="link" onClick={handleAddCustomField} className='text-base'>
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Field
          </Button>
        </div>
      </main>
    </div>
  );
}
