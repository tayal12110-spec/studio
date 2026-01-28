'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, DocumentReference, collection, query, where, CollectionReference, Query } from 'firebase/firestore';
import type { Employee, ReimbursementRequest } from '../../../data';
import { cn } from '@/lib/utils';

type StatusFilter = 'All' | 'Pending' | 'Approved' | 'Rejected';

const filters: StatusFilter[] = ['All', 'Pending', 'Approved', 'Rejected'];

export default function ReimbursementRequestsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();

  const [activeFilter, setActiveFilter] = useState<StatusFilter>('Rejected');

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading: isLoadingEmployee } = useDoc<Employee>(employeeRef);

  const reimbursementColRef = useMemoFirebase(
    () => (firestore && employeeId ? collection(firestore, 'employees', employeeId, 'reimbursementRequests') : null),
    [firestore, employeeId]
  ) as CollectionReference | null;
  
  const reimbursementQuery = useMemoFirebase(() => {
    if (!reimbursementColRef) return null;
    if (activeFilter === 'All') {
        return reimbursementColRef;
    }
    return query(reimbursementColRef, where('status', '==', activeFilter));
  }, [reimbursementColRef, activeFilter]) as Query | null;

  const { data: requests, isLoading: isLoadingRequests } = useCollection<ReimbursementRequest>(reimbursementQuery);

  const isLoading = isLoadingEmployee || isLoadingRequests;
  
  const totalReimbursements = useMemo(() => {
    if (!requests) return 0;
    return requests.reduce((sum, req) => sum + req.amount, 0);
  }, [requests]);

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">
          All Payments History: {isLoadingEmployee ? '...' : employee?.name || ''}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
            <div className="flex space-x-2">
            {filters.map((filter) => (
                <Button
                    key={filter}
                    variant="outline"
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                        'rounded-full px-4 py-1 h-auto text-sm',
                        activeFilter === filter
                        ? 'bg-accent text-accent-foreground border-transparent hover:bg-accent/90'
                        : 'bg-card'
                    )}
                >
                    {filter}
                </Button>
            ))}
            </div>
        </div>

        <div className="px-4 py-2 flex justify-between items-center">
            <p className="text-sm font-medium text-muted-foreground">TOTAL REIMBURSEMENTS</p>
            <p className="text-lg font-bold">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalReimbursements)}
            </p>
        </div>
        
        {isLoading ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : !requests || requests.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
                No Payments Added
            </div>
        ) : (
            <div className="p-4 space-y-4">
                {/* Render requests here when UI is provided */}
            </div>
        )}
      </main>
    </div>
  );
}
