'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useEmployees } from '@/app/dashboard/employee-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
} from '@/components/ui/alert-dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function FaceRecognitionPage() {
  const router = useRouter();
  const { employees, isLoading } = useEmployees();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFaceRecognitionEnabled, setIsFaceRecognitionEnabled] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraViewOpen, setIsCameraViewOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEnrollFace = (employeeName: string) => {
    setSelectedEmployeeName(employeeName);
    setIsCameraViewOpen(true);
  };

  useEffect(() => {
    if (isCameraViewOpen) {
      let isComponentMounted = true;
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (isComponentMounted) {
            streamRef.current = stream;
            setHasCameraPermission(true);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } else {
            stream.getTracks().forEach(track => track.stop());
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          if (isComponentMounted) {
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this app.',
            });
          }
        }
      };

      getCameraPermission();

      return () => {
        isComponentMounted = false;
        const currentStream = streamRef.current;
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
        }
        streamRef.current = null;
      };
    }
  }, [isCameraViewOpen, toast]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
        const context = canvas.getContext('2d');
        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            // In a real app, you'd send this dataUrl to your face recognition service
            console.log('Captured image data URL for', selectedEmployeeName);
        }
    }
    toast({
        title: "Face Enrolled!",
        description: `Face has been captured for ${selectedEmployeeName}.`,
    });
    setIsCameraViewOpen(false);
  };
  
  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      setIsConfirmDialogOpen(true);
    } else {
      setIsFaceRecognitionEnabled(false);
    }
  }

  const handleTurnOnConfirm = () => {
    setIsFaceRecognitionEnabled(true);
    setIsConfirmDialogOpen(false);
    toast({
      title: "Face Recognition Turned On",
      description: "Staff can now use face recognition for attendance.",
    });
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (employees.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p>No staff found to enroll.</p>
            </div>
        )
    }

    return (
      <div className="space-y-1">
        <p className="px-4 py-2 text-sm text-muted-foreground">Showing {filteredEmployees.length} staff</p>
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between bg-card p-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">{employee.avatar || employee.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{employee.name}</p>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleEnrollFace(employee.name)}>
                Enroll Face
            </Button>
          </div>
        ))}
      </div>
    );
  };

  if (isCameraViewOpen) {
    return (
        <div className="flex h-full min-h-screen flex-col bg-black">
            <header className="flex h-16 shrink-0 items-center justify-between px-4 text-white">
                <Button variant="ghost" size="icon" onClick={() => setIsCameraViewOpen(false)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                 <h1 className="text-lg font-semibold">Enroll Face for {selectedEmployeeName}</h1>
                 <div></div>
            </header>
            <main className="flex flex-1 flex-col items-center justify-center p-4">
                 <div className="w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center relative">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                    {hasCameraPermission === null && <Loader2 className="h-8 w-8 animate-spin text-white absolute" />}
                </div>
                 {hasCameraPermission === false && (
                    <Alert variant="destructive" className="mt-4 max-w-md bg-gray-900 border-red-500/50 text-white">
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
      <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Face Settings</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
              <div className="flex items-center justify-between bg-card p-4 rounded-lg">
                  <label htmlFor="face-recognition-switch" className="font-medium">Face Recognition</label>
                  <Switch 
                      id="face-recognition-switch"
                      checked={isFaceRecognitionEnabled}
                      onCheckedChange={handleSwitchChange}
                  />
              </div>

              <div className="relative flex items-center">
                  <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <Input
                      placeholder="Search employee"
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="outline" size="icon" className="ml-2">
                      <SlidersHorizontal className="h-5 w-5" />
                  </Button>
              </div>
          </div>
          {renderContent()}
        </main>
      </div>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have staff pending enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Staff without face enrolled can mark attendance without face recognition
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction onClick={handleTurnOnConfirm} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Turn On
            </AlertDialogAction>
            <AlertDialogCancel className="w-full mt-0">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
