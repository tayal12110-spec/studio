'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

type LeaveType = {
  name: string;
  avatarChar: string;
  avatarColor: string;
};

const leaveTypes: LeaveType[] = [
  { name: 'Casual Leave', avatarChar: 'C', avatarColor: 'bg-green-500' },
  { name: 'Privileged Leave', avatarChar: 'P', avatarColor: 'bg-pink-500' },
  { name: 'Sick Leave', avatarChar: 'S', avatarColor: 'bg-green-500' },
];

const LeaveTypeItem = ({ leaveType }: { leaveType: LeaveType }) => (
    <Card>
        <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${leaveType.avatarColor} text-white font-semibold`}>
                        {leaveType.avatarChar}
                    </AvatarFallback>
                </Avatar>
                <p className="font-medium text-base">{leaveType.name}</p>
            </div>
            <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
            </Button>
        </CardContent>
    </Card>
);

export default function CustomPaidLeavesPage() {
  const router = useRouter();

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
        <h1 className="ml-4 text-lg font-semibold">Custom Paid Leaves</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="space-y-3">
          {leaveTypes.map((leave) => (
            <LeaveTypeItem key={leave.name} leaveType={leave} />
          ))}
        </div>
      </main>
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
          <Plus className="mr-2 h-5 w-5" />
          Add New Leave
        </Button>
      </footer>
    </div>
  );
}
