'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, MoreVertical, Plus, Target, Loader2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser, deleteDocumentNonBlocking } from '@/firebase';
import { collection, CollectionReference, doc } from 'firebase/firestore';
import type { Branch } from '../../../../data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useToast } from '@/hooks/use-toast';

const BranchItem = ({
  branch,
  onEdit,
  onDelete,
}: {
  branch: Branch;
  onEdit: (id: string) => void;
  onDelete: (branch: Branch) => void;
}) => (
  <Card>
    <CardContent className="flex items-start justify-between p-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center text-center text-muted-foreground">
          <Target className="h-6 w-6" />
          <span className="text-sm font-medium">{branch.radius} M</span>
          <span className="text-xs">Radius</span>
        </div>
        <div>
          <p className="font-semibold">{branch.name}</p>
          <p className="text-sm text-muted-foreground">{branch.address}</p>
        </div>
      </div>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(branch.id)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => onDelete(branch)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardContent>
  </Card>
);

export default function MyBranchesPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);


  const branchesCol = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'branches') : null),
    [firestore, user]
  ) as CollectionReference | null;

  const { data: branches, isLoading: isLoadingBranches } = useCollection<Branch>(branchesCol);

  const isLoading = isUserLoading || isLoadingBranches;

  const handleDeleteConfirm = () => {
    if (!firestore || !branchToDelete) return;
    const branchRef = doc(firestore, 'branches', branchToDelete.id);
    deleteDocumentNonBlocking(branchRef);
    toast({
      title: 'Branch Deleted',
      description: `The branch "${branchToDelete.name}" has been deleted.`,
    });
    setBranchToDelete(null);
  };
  
  const handleEdit = (branchId: string) => {
    router.push(`/dashboard/settings/company/branches/${branchId}/edit`);
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
          <h1 className="ml-4 text-lg font-semibold">Branches</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : branches && branches.length > 0 ? (
            <div className="space-y-3">
              {branches.map((branch) => (
                <BranchItem
                  key={branch.id}
                  branch={branch}
                  onEdit={handleEdit}
                  onDelete={setBranchToDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>No branches added yet.</p>
            </div>
          )}
        </main>
        <div className="fixed bottom-20 right-6 z-10 md:bottom-6">
            <Button asChild className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90">
                <Link href="/dashboard/settings/company/branches/add">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Branch
                </Link>
            </Button>
        </div>
      </div>
      <AlertDialog open={!!branchToDelete} onOpenChange={(open) => !open && setBranchToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this branch?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the branch
                    "{branchToDelete?.name}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
