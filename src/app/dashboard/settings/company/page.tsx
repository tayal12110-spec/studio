'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Building2, GitBranch, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const SettingsItem = ({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) => {
  return (
    <Link href={href}>
      <div className="flex items-center justify-between bg-card p-4 rounded-lg cursor-pointer hover:bg-muted/50 border">
        <div className="flex items-center gap-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
          <span className="font-medium text-base">{label}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Link>
  );
};


export default function CompanySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const companyCode = 'GVVEF7';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(companyCode);
    toast({
      title: 'Copied to clipboard!',
      description: `Company code ${companyCode} has been copied.`,
    });
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Company Settings</h1>
      </header>
      <main className="flex-1 p-4">
        <div className="space-y-3">
            <SettingsItem icon={Building2} label="Company Details" href="/dashboard/settings/company/details" />
            <SettingsItem icon={GitBranch} label="My Branches" href="#" />
            <SettingsItem icon={GitBranch} label="My Departments" href="#" />
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card p-4">
        <div className="flex items-center justify-center max-w-md mx-auto">
            <span className="text-muted-foreground">Company Code:</span>
            <span className="ml-2 font-semibold">{companyCode}</span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy company code">
                <Copy className="h-5 w-5" />
            </Button>
        </div>
      </footer>
    </div>
  );
}
