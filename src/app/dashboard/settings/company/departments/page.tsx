
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Plus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
  addDocumentNonBlocking,
} from '@/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Define a type for Department
type Department = {
  id: string;
  name: string;
};

const DepartmentItem = ({ department }: { department: Department }) => (
  <Card>
    <CardContent className="flex items-start justify-between p-4">
      <p className="font-semibold">{department.name}</p>
    </CardContent>
  </Card>
);

export default function MyDepartmentsPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const departmentsCol = useMemoFirebase(
    () => (firestore && user && !isUserLoading ? collection(firestore, 'departments') : null),
    [firestore, user, isUserLoading]
  ) as CollectionReference | null;

  const { data: departments, isLoading: isLoadingDepartments } =
    useCollection<Department>(departmentsCol);

  const isLoading = isUserLoading || isLoadingDepartments;

  const handleAddDepartment = () => {
    if (!departmentName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Department name is required',
      });
      return;
    }
    if (!departmentsCol) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available. Please try again.',
      });
      return;
    }
    setIsSaving(true);

    addDocumentNonBlocking(departmentsCol, { name: departmentName });

    toast({
      title: 'Department Added!',
      description: `The department "${departmentName}" has been successfully added.`,
    });

    setTimeout(() => {
      setIsSaving(false);
      setDepartmentName('');
      setIsSheetOpen(false);
    }, 500);
  };
  
  const openSheet = () => {
    setDepartmentName('');
    setIsSaving(false);
    setIsSheetOpen(true);
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
          <h1 className="ml-4 text-lg font-semibold">Departments</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : departments && departments.length > 0 ? (
            <div className="space-y-3">
              {departments.map((department) => (
                <DepartmentItem key={department.id} department={department} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              <p>No Departments Added</p>
            </div>
          )}
        </main>
        
        <div className="fixed bottom-24 left-4 z-10 md:bottom-6">
            <Button onClick={openSheet} className="h-14 w-14 rounded-full bg-accent shadow-lg">
                <Plus className="h-7 w-7" />
            </Button>
        </div>

      </div>
      
      <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
          <SheetHeader className="p-6 pb-2 text-left">
            <SheetTitle className="flex items-center justify-between text-xl font-semibold">
              Add Department
                <SheetClose>
                  <X className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">Close</span>
                </SheetClose>
            </SheetTitle>
          </SheetHeader>
          <div className="px-6 py-4">
            <Label htmlFor="department-name" className="text-muted-foreground">Department Name</Label>
            <Input
              id="department-name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="eg. Sales, Marketing etc"
              className="mt-1"
            />
          </div>
          <SheetFooter className="grid grid-cols-2 gap-4 p-6 bg-slate-50 dark:bg-gray-800/50">
              <SheetClose asChild>
                  <Button variant="outline" className="h-12 text-base">Cancel</Button>
              </SheetClose>
              <Button
                onClick={handleAddDepartment}
                disabled={isSaving || !departmentName.trim()}
                className="h-12 bg-accent text-base text-accent-foreground hover:bg-accent/90"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add
              </Button>
          </SheetFooter>
      </SheetContent>

    </Sheet>
  );
}
    
