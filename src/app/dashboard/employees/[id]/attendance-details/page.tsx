'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { useToast } from '@/hooks/use-toast';

const DetailRow = ({
  label,
  children,
  hasNewBadge = false,
  onClick,
}: {
  label: string;
  children?: React.ReactNode;
  hasNewBadge?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Card onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {hasNewBadge && <Badge variant="destructive">New</Badge>}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {children}
          {onClick && <ChevronRight className="h-5 w-5" />}
        </div>
      </CardContent>
    </Card>
  );
};

export default function AttendanceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const [canViewOwnAttendance, setCanViewOwnAttendance] = useState(true);

  useEffect(() => {
    if (employee) {
      setCanViewOwnAttendance(employee.canViewOwnAttendance ?? true);
    }
  }, [employee]);

  const handleSwitchChange = (checked: boolean) => {
    if (!employeeRef) return;
    setCanViewOwnAttendance(checked);
    updateDocumentNonBlocking(employeeRef, { canViewOwnAttendance: checked });
    toast({
      title: 'Setting updated',
      description: `Staff can ${checked ? 'now' : 'no longer'} view their own attendance.`,
    });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Attendance Details</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            <DetailRow
              label="Work Timings"
              hasNewBadge
              onClick={() => router.push(`/dashboard/employees/${employeeId}/work-timings`)}
            >
               <div className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Not Set</span>
               </div>
            </DetailRow>

            <DetailRow label="Attendance Modes" hasNewBadge onClick={() => router.push(`/dashboard/employees/${employeeId}/attendance-modes`)} />

            <DetailRow label="Automation Rules" hasNewBadge onClick={() => router.push(`/dashboard/employees/${employeeId}/automation-rules`)} />

            <DetailRow label="Staff can view own attendance">
              <Switch
                checked={canViewOwnAttendance}
                onCheckedChange={handleSwitchChange}
              />
            </DetailRow>
          </div>
        )}
      </main>
    </div>
  );
}
