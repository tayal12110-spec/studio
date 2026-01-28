'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';

const LeaveBalanceCard = ({ title, value }: { title: string; value: number }) => (
  <div className="flex-1 text-center">
    <p className="text-sm text-muted-foreground truncate">{title}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default function LeaveRequestsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const leaveBalances = employee?.leaveBalances || { privileged: 0, sick: 0, casual: 0 };

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">
          Leave Requests - {isLoading ? '...' : employee?.name || 'Employee'}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Tabs defaultValue="request">
          <TabsList className="w-full h-auto justify-start rounded-none bg-primary p-0">
            <TabsTrigger value="request" className="flex-1 rounded-none text-primary-foreground/70 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold">
              REQUEST
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 rounded-none text-primary-foreground/70 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold">
              HISTORY
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="request" className="p-4 space-y-6">
            <div>
                <h2 className="text-base font-semibold mb-2">Leave Balance</h2>
                <Card>
                    <CardContent className="flex p-4">
                        {isLoading ? (
                             <div className="flex w-full justify-center items-center h-12">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                             </div>
                        ) : (
                            <>
                                <LeaveBalanceCard title="Privilege..." value={leaveBalances.privileged} />
                                <div className="border-l mx-2"></div>
                                <LeaveBalanceCard title="Sick Leave" value={leaveBalances.sick} />
                                <div className="border-l mx-2"></div>
                                <LeaveBalanceCard title="Casual L..." value={leaveBalances.casual} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                 <h2 className="text-base font-semibold mb-4">Pending Requests</h2>
                 <div className="text-center py-12 text-muted-foreground">
                    No Pending Requests
                 </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-4">
            <div className="text-center py-12 text-muted-foreground">
                No leave history found.
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
