
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
} from '@/firebase';
import { collection, CollectionReference } from 'firebase/firestore';

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

  const departmentsCol = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'departments') : null),
    [firestore, user]
  ) as CollectionReference | null;

  const { data: departments, isLoading: isLoadingDepartments } =
    useCollection<Department>(departmentsCol);

  const isLoading = isUserLoading || isLoadingDepartments;

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
            <div className="text-center py-20 text-muted-foreground">
              <p>No Departments Added</p>
            </div>
          )}
        </main>
        <footer className="fixed bottom-0 left-0 right-0 border-t bg-card p-4 flex justify-center">
            <Button asChild className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90">
                <Link href="/dashboard/settings/company/departments/add">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Department
                </Link>
            </Button>
        </footer>
      </div>
    </>
  );
}
