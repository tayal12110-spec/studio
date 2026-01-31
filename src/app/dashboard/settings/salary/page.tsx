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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [periodType, setPeriodType] = useState('calendar');
  const [roundOff, setRoundOff] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [targetPeriodType, setTargetPeriodType] = useState<'calendar' | 'fixed' | null>(null);

  const [isFixedDaysSheetOpen, setIsFixedDaysSheetOpen] = useState(false);
  const [fixedDayType, setFixedDayType] = useState('30');
  const [tempFixedDayType, setTempFixedDayType] = useState('30');

  const handlePeriodTypeClick = (type: 'calendar' | 'fixed') => {
    if (periodType !== type) {
      setTargetPeriodType(type);
      setIsConfirmDialogOpen(true);
    } else if (type === 'fixed') {
      setTempFixedDayType(fixedDayType);
      setIsFixedDaysSheetOpen(true);
    }
  };

  const handleConfirmChange = () => {
    if (targetPeriodType) {
      setPeriodType(targetPeriodType);
      if (targetPeriodType === 'fixed') {
        setTempFixedDayType(fixedDayType);
        setIsFixedDaysSheetOpen(true);
      }
    }
    setIsConfirmDialogOpen(false);
  };
  
  const handleSaveFixedDays = () => {
    setFixedDayType(tempFixedDayType);
    setIsFixedDaysSheetOpen(false);
    toast({
      title: 'Details Saved',
      description: `Period type updated to ${tempFixedDayType} day month.`,
    });
  };


  return (
    <>
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
                onClick={() => handlePeriodTypeClick('calendar')}
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
                onClick={() => handlePeriodTypeClick('fixed')}
              >
                 <div className="flex justify-end mb-2 h-5">
                  {periodType === 'fixed' && <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground"><Check className="h-3 w-3" /></div>}
                </div>
                <h3 className="font-semibold">Fixed Days Month</h3>
                <p className="text-sm text-muted-foreground">
                  {fixedDayType} days month
                  <br />
                  {fixedDayType === '26' ? '26 days month' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
              <SettingsRow icon={CalendarDays} label="Attendance Cycle" onClick={() => router.push('/dashboard/settings/salary/attendance-cycle')} />
              <SettingsRow icon={Wallet} label="Manage Salary (CTC Template)" onClick={() => router.push('/dashboard/settings/salary/templates')} />
              <SettingsRow icon={HandCoins} label="Manage Incentive Types" onClick={() => router.push('/dashboard/settings/salary/incentive-types')} />
              <SettingsRow icon={Wallet} label="Round Off Total Salary">
                  <Switch checked={roundOff} onCheckedChange={setRoundOff} />
              </SettingsRow>
          </div>
        </main>
      </div>
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-xl">
              Change to {targetPeriodType === 'calendar' ? 'Calendar month' : 'Fixed days month'}?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Change month calculation from {periodType === 'calendar' ? 'calendar month' : '30 day month'} to {targetPeriodType === 'calendar' ? 'calendar month' : '30 day month'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-col-reverse gap-2 sm:gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmChange}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={isFixedDaysSheetOpen} onOpenChange={setIsFixedDaysSheetOpen}>
        <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
            <SheetHeader className="p-6 pb-2 text-center">
              <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
              <SheetTitle>Period Type</SheetTitle>
            </SheetHeader>
            <div className="px-6 py-4">
              <RadioGroup
                value={tempFixedDayType}
                onValueChange={(value) => setTempFixedDayType(value)}
                className="space-y-3"
              >
                <Label htmlFor="30-day" className="flex flex-col rounded-lg border p-4 cursor-pointer has-[:checked]:border-primary">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-semibold">30 Day Month</p>
                            <p className="text-sm text-muted-foreground">eg. Jan - 30 days<br />Feb - 30 days</p>
                        </div>
                        <RadioGroupItem value="30" id="30-day" />
                    </div>
                </Label>
                <Label htmlFor="26-day" className="flex flex-col rounded-lg border p-4 cursor-pointer has-[:checked]:border-primary">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-semibold">26 Days Month</p>
                            <p className="text-sm text-muted-foreground">eg. Jan - 26 days<br />Feb - 26 days</p>
                        </div>
                        <RadioGroupItem value="26" id="26-day" />
                    </div>
                </Label>
              </RadioGroup>
            </div>
            <SheetFooter className="p-6 pt-2">
                <Button
                    onClick={handleSaveFixedDays}
                    className="h-12 w-full text-base bg-accent text-accent-foreground hover:bg-accent/90"
                >
                    Save Details
                </Button>
            </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
