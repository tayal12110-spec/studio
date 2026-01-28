'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DetailRow = ({
  label,
  children,
  onClick,
}: {
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Card onClick={onClick} className={onClick ? 'cursor-pointer hover:bg-muted/50' : ''}>
      <CardContent className="flex items-center justify-between p-4">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2 text-muted-foreground">
          {children}
          {onClick && <ChevronRight className="h-5 w-5" />}
        </div>
      </CardContent>
    </Card>
  );
};

export default function LeaveBalancesPolicyPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-gray-950">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Leave Balances &amp; Policy</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <DetailRow
            label="Leave Balances"
            onClick={() => {
              router.push(`/dashboard/employees/${employeeId}/leave-balances`);
            }}
          />
          <DetailRow
            label="Leave Policy"
            onClick={() => {
              // Placeholder for future navigation
            }}
          >
             <div className="flex items-center gap-1 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Not Set</span>
             </div>
          </DetailRow>
        </div>
      </main>
    </div>
  );
}
