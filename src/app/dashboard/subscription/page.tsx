'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  Info,
  Gem,
  FileBarChart2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const SettingsItem = ({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}) => {
  const content = (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <span className="font-medium text-base">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline text-foreground">
        {content}
      </Link>
    );
  }
  return content;
};

export default function SubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleDownloadInvoices = () => {
    toast({
      title: 'Coming Soon!',
      description: 'Invoice download functionality is under development.',
    });
  };

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
        <h1 className="ml-4 text-lg font-semibold">Subscriptions & Billing</h1>
      </header>
      <main className="flex-1 p-4">
        <Card>
          <CardContent className="p-0 divide-y">
            <SettingsItem
              icon={Info}
              label="Check current plan details"
              href="/dashboard/subscription/upgrade"
            />
            <SettingsItem
              icon={Gem}
              label="Upgrade Plan"
              href="/dashboard/subscription/upgrade"
            />
            <SettingsItem
              icon={FileBarChart2}
              label="Download Invoices"
              onClick={handleDownloadInvoices}
            />
          </CardContent>
        </Card>
      </main>
       <div className="fixed bottom-24 left-6 z-10 md:bottom-6">
        <Button size="icon" className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90">
          <Plus className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
