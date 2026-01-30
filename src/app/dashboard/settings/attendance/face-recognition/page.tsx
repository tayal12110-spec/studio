'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useEmployees } from '@/app/dashboard/employee-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Employee } from '@/app/dashboard/data';
import { useToast } from '@/hooks/use-toast';

export default function FaceRecognitionPage() {
  const router = useRouter();
  const { employees, isLoading } = useEmployees();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFaceRecognitionEnabled, setIsFaceRecognitionEnabled] = useState(false);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEnrollFace = (employeeName: string) => {
    toast({
        title: "Enrollment Started",
        description: `Starting face enrollment for ${employeeName}.`,
    });
    // Here you would integrate with a face enrollment API or flow.
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

  return (
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
                    onCheckedChange={setIsFaceRecognitionEnabled}
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
  );
}
