'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

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
  const content = (
    <Card onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {hasNewBadge && <Badge variant="destructive" className="bg-red-500 text-white">New</Badge>}
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

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Attendance Details</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <DetailRow
            label="Work Timings"
            hasNewBadge
            onClick={() => router.push(`/dashboard/employees/${employeeId}/work-timings`)}
          >
             <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>Not Set</span>
             </div>
          </DetailRow>

          <DetailRow label="Attendance Modes" hasNewBadge onClick={() => {}} />

          <DetailRow label="Automation Rules" hasNewBadge onClick={() => {}} />

          <DetailRow label="Staff can view own attendance">
            <Switch defaultChecked />
          </DetailRow>
        </div>
      </main>
    </div>
  );
}
