'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  Wallet,
  HandCoins,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const SettingsRow = ({
  icon: Icon,
  label,
  children,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) => (
  <Card onClick={onClick} className={cn(onClick && 'cursor-pointer hover:bg-muted/50')}>
    <CardContent className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {onClick && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
      </div>
    </CardContent>
  </Card>
);

export default function SalarySettingsPage() {
  const router = useRouter();
  const [periodType, setPeriodType] = useState('calendar');
  const [roundOff, setRoundOff] = useState(false);

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
        <h1 className="ml-4 text-lg font-semibold">Salary Settings</h1>
      </header>
      <main className="flex-1 space-y-6 p-4">
        <div>
          <Label className="px-1 text-base text-muted-foreground">Select period type</Label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div
              className={cn(
                'rounded-lg border-2 p-3 cursor-pointer',
                periodType === 'calendar'
                  ? 'border-primary bg-primary/5'
                  : 'border-input bg-card'
              )}
              onClick={() => setPeriodType('calendar')}
            >
              <div className="flex justify-end mb-2 h-5">
                {periodType === 'calendar' && <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground"><Check className="h-3 w-3" /></div>}
              </div>
              <h3 className="font-semibold">Calendar Month</h3>
              <p className="text-sm text-muted-foreground">
                eg. Jan - 31 days
                <br />
                feb - 28 days
              </p>
            </div>
            <div
              className={cn(
                'rounded-lg border-2 p-3 cursor-pointer',
                periodType === 'fixed'
                  ? 'border-primary bg-primary/5'
                  : 'border-input bg-card'
              )}
              onClick={() => setPeriodType('fixed')}
            >
               <div className="flex justify-end mb-2 h-5">
                {periodType === 'fixed' && <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground"><Check className="h-3 w-3" /></div>}
              </div>
              <h3 className="font-semibold">Fixed Days Month</h3>
              <p className="text-sm text-muted-foreground">
                30 days month
                <br />
                26 days month
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
            <SettingsRow icon={CalendarDays} label="Attendance Cycle" onClick={() => {}} />
            <SettingsRow icon={Wallet} label="Manage Salary (CTC Template)" onClick={() => {}} />
            <SettingsRow icon={HandCoins} label="Manage Incentive Types" onClick={() => {}} />
            <SettingsRow icon={Wallet} label="Round Off Total Salary">
                <Switch checked={roundOff} onCheckedChange={setRoundOff} />
            </SettingsRow>
        </div>
      </main>
    </div>
  );
}
