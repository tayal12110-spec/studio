'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const PermissionRow = ({
  label,
  href,
}: {
  label: string;
  href: string;
}) => (
  <Link href={href}>
    <Card className="cursor-pointer hover:bg-muted/50">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Users className="h-6 w-6 text-muted-foreground" />
          <span className="font-medium text-base">{label}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  </Link>
);

export default function UsersAndPermissionsPage() {
  const router = useRouter();

  const items = [
    { label: 'Admins', href: '/dashboard/settings/users-and-permissions/admins' },
    { label: 'Employee & Managers', href: '/dashboard/settings/users-and-permissions/employees-and-managers' },
    { label: 'Chartered Accountant', href: '/dashboard/settings/users-and-permissions/chartered-accountants' },
  ];

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
        <h1 className="ml-4 text-lg font-semibold">Users & Permissions</h1>
      </header>
      <main className="flex-1 p-4">
        <div className="space-y-3">
          {items.map((item) => (
            <PermissionRow key={item.label} label={item.label} href={item.href} />
          ))}
        </div>
      </main>
    </div>
  );
}
