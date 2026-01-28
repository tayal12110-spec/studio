'use client';

import { useState, useRef, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function DocumentsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } = useDoc<Employee>(employeeRef);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [docType, setDocType] = useState('Aadhaar');
  const [isCameraViewOpen, setIsCameraViewOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isCameraViewOpen) {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        return;
    }

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [isCameraViewOpen, toast]);


  const handleNext = () => {
    setIsAddDialogOpen(false);
    setIsUploadDialogOpen(true);
  };

  const handleUploadOption = (option: 'camera' | 'gallery' | 'document') => {
    setIsUploadDialogOpen(false);
    if (option === 'camera') {
        setIsCameraViewOpen(true);
    } else {
        // In a real app, this would trigger the native file picker.
        console.log(`Selected an upload option: ${option}`);
        toast({
            title: "Feature not implemented",
            description: `Choosing from ${option} is not yet implemented.`,
        });
    }
  }

  const handleCapture = () => {
    // In a real app, this would capture the frame and process it.
    toast({
        title: "Image Captured!",
        description: "The document image has been captured (simulation)."
    });
    setIsCameraViewOpen(false);
  };

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

  if (isCameraViewOpen) {
    return (
        <div className="flex h-full flex-col bg-black">
            <header className="flex h-16 shrink-0 items-center justify-between px-4 text-white">
                <Button variant="ghost" size="icon" onClick={() => setIsCameraViewOpen(false)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                 <h1 className="text-lg font-semibold">Take a picture of {docType}</h1>
                 <div></div>
            </header>
            <main className="flex flex-1 flex-col items-center justify-center p-4">
                 <div className="w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center relative">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {hasCameraPermission === null && <Loader2 className="h-8 w-8 animate-spin text-white absolute" />}
                </div>
                 {hasCameraPermission === false && (
                    <Alert variant="destructive" className="mt-4 bg-gray-900 border-red-500/50 text-white">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription className="text-gray-300">
                            Please allow camera access in your browser settings to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
            </main>
            <footer className="shrink-0 p-4 flex justify-center">
                 <Button size="icon" className="h-20 w-20 rounded-full border-4 border-white bg-transparent hover:bg-white/20" onClick={handleCapture} disabled={hasCameraPermission !== true}>
                    <div className="h-16 w-16 rounded-full bg-white"></div>
                 </Button>
            </footer>
        </div>
    )
}

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
                <button onClick={() => handleUploadOption('camera')} className="text-left px-6 py-4 hover:bg-muted">Take a picture</button>
                <button onClick={() => handleUploadOption('gallery')} className="text-left px-6 py-4 hover:bg-muted">Choose from gallery</button>
                <button onClick={() => handleUploadOption('document')} className="text-left px-6 py-4 hover:bg-muted">Choose Document</button>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
