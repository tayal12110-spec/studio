'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DocumentsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } = useDoc<Employee>(employeeRef);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [docType, setDocType] = useState('Aadhaar');

  const handleNext = () => {
    setIsAddDialogOpen(false);
    setIsUploadDialogOpen(true);
  };

  const handleUploadOption = () => {
    // In a real app, this would trigger the native file picker or camera.
    console.log('Selected an upload option.');
    setIsUploadDialogOpen(false);
  }

  // This will be expanded later to show the list of documents
  const renderContent = () => {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">No documents found</h2>
            <p className="text-muted-foreground">
              You can add documents here like
              <br />
              Aadhaar, PAN etc.
            </p>
          </div>
        </div>
      );
  };

  return (
    <>
      <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
        <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">
            {isLoadingEmployee ? 'Documents' : `${employee?.name}'s Documents`}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          {isLoadingEmployee ? (
             <div className="flex flex-1 items-center justify-center">
               <Loader2 className="h-8 w-8 animate-spin" />
             </div>
          ) : renderContent()}
        </main>
        
        <footer className="shrink-0 border-t bg-card p-4">
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
              <Plus className="mr-2 h-5 w-5" />
              Add Document
          </Button>
        </footer>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">Please select document type</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <Select onValueChange={setDocType} defaultValue={docType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aadhaar">Aadhaar</SelectItem>
                <SelectItem value="PAN Card">PAN Card</SelectItem>
                <SelectItem value="Voter ID">Voter ID</SelectItem>
                <SelectItem value="Driving License">Driving License</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex-col items-center pt-4 gap-2">
            <Button onClick={handleNext} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
              Next
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="link" className="font-normal text-muted-foreground h-auto">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-xs p-0">
            <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-lg font-semibold">Upload {docType}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col text-base">
                <button onClick={handleUploadOption} className="text-left px-6 py-4 hover:bg-muted">Take a picture</button>
                <button onClick={handleUploadOption} className="text-left px-6 py-4 hover:bg-muted">Choose from gallery</button>
                <button onClick={handleUploadOption} className="text-left px-6 py-4 hover:bg-muted">Choose Document</button>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
