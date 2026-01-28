'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Card onClick={onClick} className={onClick ? 'cursor-pointer hover:bg-muted/50' : ''}>
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

export default function EmployeeRequestsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Employee Requests</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <DetailRow
            label="Leave Requests"
            onClick={() => router.push(`/dashboard/employees/${employeeId}/leave-requests`)}
          />
          <DetailRow
            label="Reimbursement Requests"
            hasNewBadge
            // onClick={() => router.push(`/dashboard/employees/${employeeId}/reimbursement-requests`)}
          />
        </div>
      </main>
    </div>
  );
}
