'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MoreVertical, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BranchItem = ({
  name,
  address,
  radius,
}: {
  name: string;
  address: string;
  radius: number;
}) => (
  <Card>
    <CardContent className="flex items-start justify-between p-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center text-center text-muted-foreground">
          <Target className="h-6 w-6" />
          <span className="text-sm font-medium">{radius} M</span>
          <span className="text-xs">Radius</span>
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{address}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </CardContent>
  </Card>
);

export default function MyBranchesPage() {
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
        <h1 className="ml-4 text-lg font-semibold">Branches</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <BranchItem
            name="tut"
            address="187, Sukhdev Vihar, Okhla, New Delhi, Delhi 110025, India"
            radius={100}
          />
        </div>
      </main>
      <div className="fixed bottom-6 right-6 z-10">
          <Button asChild className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90">
              <Link href="/dashboard/settings/company/branches/add">
                <Plus className="mr-2 h-5 w-5" />
                Add Branch
              </Link>
          </Button>
      </div>
    </div>
  );
}
