'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RuleRow = ({
  label,
  children,
  isLast = false,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <div
    className={`flex items-center justify-between p-4 ${
      !isLast ? 'border-b' : ''
    }`}
  >
    <p className="font-medium text-base">{label}</p>
    {children}
  </div>
);

type RuleType = 'late' | 'halfDay' | 'fullDay';

export default function AutomationRulesPage() {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<{type: RuleType, title: string} | null>(null);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const [lateRule, setLateRule] = useState<string | null>(null);
  const [halfDayRule, setHalfDayRule] = useState<string | null>(null);
  const [fullDayRule, setFullDayRule] = useState<string | null>(null);

  const handleRuleClick = (type: RuleType, title: string) => {
    let currentRuleValue: string | null = null;
    if (type === 'late') currentRuleValue = lateRule;
    else if (type === 'halfDay') currentRuleValue = halfDayRule;
    else if (type === 'fullDay') currentRuleValue = fullDayRule;

    if (currentRuleValue) {
        const parts = currentRuleValue.split(' ');
        setHours(parts[0] || '');
        setMinutes(parts[2] || '');
    } else {
        setHours('');
        setMinutes('');
    }

    setEditingRule({ type, title });
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!editingRule) return;

    const hourVal = parseInt(hours, 10) || 0;
    const minVal = parseInt(minutes, 10) || 0;
    
    if (hourVal === 0 && minVal === 0) {
      handleTurnOff();
      return;
    }

    const displayValue = `${hourVal} hours ${minVal} minutes`;

    if (editingRule.type === 'late') {
      setLateRule(displayValue);
    } else if (editingRule.type === 'halfDay') {
      setHalfDayRule(displayValue);
    } else if (editingRule.type === 'fullDay') {
      setFullDayRule(displayValue);
    }
    setIsDialogOpen(false);
  };

  const handleTurnOff = () => {
    if (!editingRule) return;

     if (editingRule.type === 'late') {
      setLateRule(null);
    } else if (editingRule.type === 'halfDay') {
      setHalfDayRule(null);
    } else if (editingRule.type === 'fullDay') {
      setFullDayRule(null);
    }
    setIsDialogOpen(false);
  };


  return (
    <>
    <div className="flex h-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
          className="hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Automation Rules</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardContent className="p-0">
            <RuleRow label="Auto Present at day start">
              <Switch />
            </RuleRow>

            <RuleRow label="Present on Punch In">
              <Switch defaultChecked />
            </RuleRow>

            <RuleRow label="Auto half day if late by">
              <Button variant="ghost" className={lateRule ? "text-primary font-medium" : "text-muted-foreground"} onClick={() => handleRuleClick('late', 'Auto half day if late by')}>
                {lateRule || 'Not Set'}
              </Button>
            </RuleRow>

            <RuleRow label="Mandatory half day hours">
              <Button variant="ghost" className={halfDayRule ? "text-primary font-medium" : "text-muted-foreground"} onClick={() => handleRuleClick('halfDay', 'Mandatory half day hours')}>
                {halfDayRule || 'Not Set'}
              </Button>
            </RuleRow>

            <RuleRow label="Mandatory full day hours" isLast={true}>
              <Button variant="ghost" className={fullDayRule ? "text-primary font-medium" : "text-muted-foreground"} onClick={() => handleRuleClick('fullDay', 'Mandatory full day hours')}>
                {fullDayRule || 'Not Set'}
              </Button>
            </RuleRow>
          </CardContent>
        </Card>
      </main>
    </div>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
            <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-xl text-left font-semibold">{editingRule?.title}</DialogTitle>
                 <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </Button>
                 </DialogClose>
            </DialogHeader>
             <div className="px-6 pb-6">
                <div className="space-y-2">
                    <Label className='text-muted-foreground'>Select Duration</Label>
                    <div className="flex items-center gap-4">
                        <div className='flex items-center gap-2'>
                           <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} className="w-24 text-base p-3 text-center" placeholder="00" />
                           <Label htmlFor="hours" className='text-base'>hours</Label>
                        </div>
                         <div className='flex items-center gap-2'>
                           <Input id="minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="w-24 text-base p-3 text-center" placeholder="00" />
                           <Label htmlFor="minutes" className='text-base'>minutes</Label>
                        </div>
                    </div>
                </div>
            </div>
            <DialogFooter className="flex-row justify-end gap-2 p-4 bg-slate-50 dark:bg-gray-800/50 border-t">
                <Button type="button" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-500/50 dark:hover:bg-red-500/10 dark:hover:text-red-500" onClick={handleTurnOff}>Turn Off</Button>
                <Button onClick={handleConfirm} className="bg-accent text-accent-foreground hover:bg-accent/90">Confirm</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
