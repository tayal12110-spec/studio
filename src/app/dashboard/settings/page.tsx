'use client';

import {
  Bell,
  HelpCircle,
  Building2,
  CreditCard,
  ShieldCheck,
  Users,
  ClipboardList,
  CalendarCheck,
  Wallet,
  BarChart3,
  Puzzle,
  Gift,
  ChevronRight,
  Heart,
  Shield,
  FileText,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const SettingsRow = ({
  icon: Icon,
  label,
  children,
  href,
  hasBadge,
}: {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
  href?: string;
  hasBadge?: boolean;
}) => {
  const content = (
    <div
      className={cn(
        'flex items-center justify-between bg-card p-4 rounded-lg cursor-pointer hover:bg-muted/50',
        'border'
      )}
    >
      <div className="flex items-center gap-4">
        <Icon className="h-6 w-6 text-accent" />
        <div className="flex items-center gap-2">
          <span className="font-medium text-base">{label}</span>
           {hasBadge && <Badge variant="destructive" className="bg-red-500 text-white">Earn 10%</Badge>}
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        {children}
        <ChevronRight className="h-5 w-5" />
      </div>
    </div>
  );
  
  if (href) {
    return <Link href={href} className="no-underline">{content}</Link>;
  }
  return <div className="cursor-pointer">{content}</div>;
};

export default function SettingsPage() {
  const router = useRouter();

  const settingsItems = [
    { icon: Building2, label: 'Company Settings', href: '/dashboard/settings/company' },
    {
      icon: FileText,
      label: 'Subscriptions & Billing',
      href: '/dashboard/subscription',
    },
    { icon: ShieldCheck, label: 'Background Verification' },
    { icon: Users, label: 'Users & Permissions' },
    { icon: ClipboardList, label: 'Custom Fields' },
    { icon: CalendarCheck, label: 'Attendance Settings' },
    { icon: Wallet, label: 'Salary Settings' },
    { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
    { icon: Puzzle, label: 'Free Tools' },
    { icon: Gift, label: 'Refer & Earn', hasBadge: true },
    { icon: SettingsIcon, label: 'More' },
  ];

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
        <h1 className="text-xl font-semibold">Settings</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button size="sm">
            <HelpCircle className="mr-2 h-4 w-4" /> Help
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="space-y-3">
          {settingsItems.map((item) => (
            <SettingsRow key={item.label} icon={item.icon} label={item.label} href={item.href} hasBadge={item.hasBadge} />
          ))}
        </div>

        <div className="mt-8">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className='flex flex-col items-center justify-center text-center gap-2 p-4'>
                    <div className='bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 p-2 rounded-lg'>
                        <Shield className='h-6 w-6' />
                    </div>
                    <p className='font-semibold text-blue-800 dark:text-blue-200'>100% Secure</p>
                    <p className='text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1'>MADE WITH <Heart className="h-3 w-3 fill-current" /> IN INDIA</p>
                </CardContent>
            </Card>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">v-6.87</p>

      </main>
    </div>
  );
}
