'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';

const Section = ({ title, children, buttonLabel, onSave, isSaving }: { title: string, children: React.ReactNode, buttonLabel: string, onSave: () => void, isSaving: boolean }) => (
    <AccordionItem value={title}>
        <AccordionTrigger className="text-lg font-medium">{title}</AccordionTrigger>
        <AccordionContent>
            <div className="space-y-6 pt-4">
                {children}
                <Button onClick={onSave} className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {buttonLabel}
                </Button>
            </div>
        </AccordionContent>
    </AccordionItem>
);


export default function PenaltyOvertimePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const [lateFine, setLateFine] = useState({
      allowedDays: '',
      gracePeriod: '',
      deductionType: 'day' as 'day' | 'hour',
      deductionRate: ''
  });

  const [earlyFine, setEarlyFine] = useState({
      allowedDays: '',
      gracePeriod: '',
      deductionType: 'day' as 'day' | 'hour',
      deductionRate: ''
  });

  const [overtimePay, setOvertimePay] = useState({
      weekOffPay: '',
      publicHolidayPay: '',
      extraHoursPay: '',
      gracePeriod: ''
  });
  
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({
      late: false,
      early: false,
      overtime: false,
  });


  useEffect(() => {
    if (employee?.penaltyAndOvertime) {
        const { lateComing, earlyLeaving, overtime } = employee.penaltyAndOvertime;
        if (lateComing) {
            setLateFine({
                allowedDays: lateComing.allowedDays?.toString() || '',
                gracePeriod: lateComing.gracePeriod || '',
                deductionType: lateComing.deductionType || 'day',
                deductionRate: lateComing.deductionRate?.toString() || ''
            });
        }
        if (earlyLeaving) {
            setEarlyFine({
                allowedDays: earlyLeaving.allowedDays?.toString() || '',
                gracePeriod: earlyLeaving.gracePeriod || '',
                deductionType: earlyLeaving.deductionType || 'day',
                deductionRate: earlyLeaving.deductionRate?.toString() || ''
            });
        }
        if (overtime) {
            setOvertimePay({
                weekOffPay: overtime.weekOffPay || '',
                publicHolidayPay: overtime.publicHolidayPay || '',
                extraHoursPay: overtime.extraHoursPay || '',
                gracePeriod: overtime.gracePeriod || ''
            });
        }
    }
  }, [employee]);

  const handleSave = (section: 'late' | 'early' | 'overtime') => {
      if (!employeeRef) return;

      setIsSaving(prev => ({...prev, [section]: true}));

      let dataToSave = {};
      let sectionName = '';

      if (section === 'late') {
          dataToSave = {
              'penaltyAndOvertime.lateComing': {
                  allowedDays: Number(lateFine.allowedDays) || 0,
                  gracePeriod: lateFine.gracePeriod,
                  deductionType: lateFine.deductionType,
                  deductionRate: Number(lateFine.deductionRate) || 0
              }
          };
          sectionName = 'Late coming fine';
      } else if (section === 'early') {
          dataToSave = {
              'penaltyAndOvertime.earlyLeaving': {
                  allowedDays: Number(earlyFine.allowedDays) || 0,
                  gracePeriod: earlyFine.gracePeriod,
                  deductionType: earlyFine.deductionType,
                  deductionRate: Number(earlyFine.deductionRate) || 0
              }
          };
          sectionName = 'Early leaving fine';
      } else if (section === 'overtime') {
          dataToSave = {
              'penaltyAndOvertime.overtime': overtimePay
          };
          sectionName = 'Overtime pay';
      }

      updateDocumentNonBlocking(employeeRef, dataToSave);

      toast({
          title: 'Settings Saved',
          description: `${sectionName} settings have been saved.`,
      });

      setTimeout(() => {
        setIsSaving(prev => ({...prev, [section]: false}));
      }, 500);
  };

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Penalty &amp; Overtime Pay</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Accordion type="multiple" defaultValue={['Late coming fine', 'Early leaving fine', 'Overtime Pay']} className="w-full max-w-2xl mx-auto space-y-4">
            
            <Section title="Late coming fine" buttonLabel="Save Late Fine" onSave={() => handleSave('late')} isSaving={isSaving.late}>
                 <div className="space-y-2">
                    <Label htmlFor="allowed-late-days">Allowed Late Days</Label>
                    <Input id="allowed-late-days" placeholder="e.g. 2" value={lateFine.allowedDays} onChange={(e) => setLateFine({...lateFine, allowedDays: e.target.value})} type="number" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="late-grace-period">Grace Period</Label>
                    <Input id="late-grace-period" placeholder="e.g. 15 minutes" value={lateFine.gracePeriod} onChange={(e) => setLateFine({...lateFine, gracePeriod: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Deduction Type</Label>
                    <RadioGroup value={lateFine.deductionType} onValueChange={(value: 'day' | 'hour') => setLateFine({...lateFine, deductionType: value})} className="flex gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="day" id="late-day" />
                            <Label htmlFor="late-day" className="font-normal">Day Wise</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hour" id="late-hour" />
                            <Label htmlFor="late-hour" className="font-normal">Hour Wise</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="late-deduction-rate">Deduction Rate</Label>
                    <Input id="late-deduction-rate" placeholder="e.g. 0.5 for half day" value={lateFine.deductionRate} onChange={(e) => setLateFine({...lateFine, deductionRate: e.target.value})} type="number" step="0.1"/>
                </div>
            </Section>

            <Section title="Early leaving fine" buttonLabel="Save Early Leaving Fine" onSave={() => handleSave('early')} isSaving={isSaving.early}>
                <div className="space-y-2">
                    <Label htmlFor="allowed-early-days">Allowed Early Leaving Days</Label>
                    <Input id="allowed-early-days" placeholder="e.g. 2" value={earlyFine.allowedDays} onChange={(e) => setEarlyFine({...earlyFine, allowedDays: e.target.value})} type="number" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="early-grace-period">Grace Period</Label>
                    <Input id="early-grace-period" placeholder="e.g. 15 minutes" value={earlyFine.gracePeriod} onChange={(e) => setEarlyFine({...earlyFine, gracePeriod: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Deduction Type</Label>
                    <RadioGroup value={earlyFine.deductionType} onValueChange={(value: 'day' | 'hour') => setEarlyFine({...earlyFine, deductionType: value})} className="flex gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="day" id="early-day" />
                            <Label htmlFor="early-day" className="font-normal">Day Wise</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hour" id="early-hour" />
                            <Label htmlFor="early-hour" className="font-normal">Hour Wise</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="early-deduction-rate">Deduction Rate</Label>
                    <Input id="early-deduction-rate" placeholder="e.g. 0.5 for half day" value={earlyFine.deductionRate} onChange={(e) => setEarlyFine({...earlyFine, deductionRate: e.target.value})} type="number" step="0.1" />
                </div>
            </Section>

            <Section title="Overtime Pay" buttonLabel="Save Overtime Pay" onSave={() => handleSave('overtime')} isSaving={isSaving.overtime}>
                <div>
                  <p className="font-medium text-base mb-2">Extra Day OT</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="week-off-pay">Week Off Pay</Label>
                        <Input id="week-off-pay" placeholder="e.g. 1.5x" value={overtimePay.weekOffPay} onChange={(e) => setOvertimePay({...overtimePay, weekOffPay: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="public-holiday-pay">Public Holiday Pay</Label>
                        <Input id="public-holiday-pay" placeholder="e.g. 2x" value={overtimePay.publicHolidayPay} onChange={(e) => setOvertimePay({...overtimePay, publicHolidayPay: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-base mb-2 mt-4">Extra Hours OT</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="extra-hours-pay">Extra Hours Pay</Label>
                        <Input id="extra-hours-pay" placeholder="e.g. 1.25x" value={overtimePay.extraHoursPay} onChange={(e) => setOvertimePay({...overtimePay, extraHoursPay: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="overtime-grace-period">Grace Period</Label>
                        <Input id="overtime-grace-period" placeholder="e.g. 30 minutes" value={overtimePay.gracePeriod} onChange={(e) => setOvertimePay({...overtimePay, gracePeriod: e.target.value})} />
                    </div>
                  </div>
                </div>
            </Section>

        </Accordion>
      </main>
    </div>
  );
}
