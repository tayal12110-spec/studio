'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const ContributionRow = ({
  label,
  amount,
  children,
}: {
  label: string;
  amount?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <p className="font-semibold">{amount ?? '₹ 0.00'}</p>
      </div>
    </div>
    {children}
  </div>
);

type ContributionOption = 'none' | 'limit' | 'variable';
type EsiOption = 'none' | 'variable';

const indianStates = [
    'Not Selected', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function SalaryDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [month, setMonth] = useState(new Date(2026, 0, 1));
  const [salaryType, setSalaryType] = useState('per-month');
  const [basicSalary, setBasicSalary] = useState('9800.00');

  // Employee PF State
  const [isPfDialogOpen, setIsPfDialogOpen] = useState(false);
  const [pfOption, setPfOption] = useState<ContributionOption>('variable');
  const [currentPfOption, setCurrentPfOption] =
    useState<ContributionOption>('variable');
  const [pfLabel, setPfLabel] = useState('12.0% Variable');
  const [pfLimitBasic, setPfLimitBasic] = useState(true);
  const [pfLimitIncentive, setPfLimitIncentive] = useState(false);
  const [pfLimitOvertime, setPfLimitOvertime] = useState(false);

  // Employer PF State
  const [isEmployerPfDialogOpen, setIsEmployerPfDialogOpen] = useState(false);
  const [employerPfOption, setEmployerPfOption] =
    useState<ContributionOption>('none');
  const [currentEmployerPfOption, setCurrentEmployerPfOption] =
    useState<ContributionOption>('none');
  const [employerPfLabel, setEmployerPfLabel] = useState('Not Selected');
  const [employerPfLimitBasic, setEmployerPfLimitBasic] = useState(true);
  const [employerPfLimitIncentive, setEmployerPfLimitIncentive] = useState(false);
  const [employerPfLimitOvertime, setEmployerPfLimitOvertime] = useState(false);


  // Employer ESI State
  const [isEsiDialogOpen, setIsEsiDialogOpen] = useState(false);
  const [esiOption, setEsiOption] = useState<EsiOption>('none');
  const [currentEsiOption, setCurrentEsiOption] = useState<EsiOption>('none');
  const [esiLabel, setEsiLabel] = useState('Not Selected');
  const [esiBasic, setEsiBasic] = useState(true);
  const [esiIncentive, setEsiIncentive] = useState(false);
  const [esiOvertime, setEsiOvertime] = useState(false);

  // Employee ESI State
  const [isEmployeeEsiDialogOpen, setIsEmployeeEsiDialogOpen] = useState(false);
  const [employeeEsiOption, setEmployeeEsiOption] = useState<EsiOption>('none');
  const [currentEmployeeEsiOption, setCurrentEmployeeEsiOption] =
    useState<EsiOption>('none');
  const [employeeEsiLabel, setEmployeeEsiLabel] = useState('Not Selected');

  // Labour Welfare Fund State
  const [isLwfDialogOpen, setIsLwfDialogOpen] = useState(false);
  const [lwfState, setLwfState] = useState('Not Selected');
  const [currentLwfState, setCurrentLwfState] = useState('Not Selected');

  // Professional Tax State
  const [isProfTaxDialogOpen, setIsProfTaxDialogOpen] = useState(false);
  const [profTaxState, setProfTaxState] = useState('Not Selected');
  const [currentProfTaxState, setCurrentProfTaxState] = useState('Not Selected');

  // Labour Welfare Fund (Deduction) State
  const [isLwfDeductionDialogOpen, setIsLwfDeductionDialogOpen] = useState(false);
  const [lwfDeductionState, setLwfDeductionState] = useState('Not Selected');
  const [currentLwfDeductionState, setCurrentLwfDeductionState] = useState('Not Selected');

  const calculateContribution = (base: string, option: ContributionOption) => {
    const salary = parseFloat(base) || 0;
    if (option === 'limit') return 1800;
    if (option === 'variable') return salary * 0.12;
    return 0;
  };

  const calculateEsiContribution = (base: string, option: EsiOption) => {
    const salary = parseFloat(base) || 0;
    if (option === 'variable') return salary * 0.0325;
    return 0;
  }

  const calculateEmployeeEsiContribution = (base: string, option: EsiOption) => {
    const salary = parseFloat(base) || 0;
    if (option === 'variable') return salary * 0.0075;
    return 0;
  };

  const pfAmount = useMemo(
    () => calculateContribution(basicSalary, currentPfOption),
    [basicSalary, currentPfOption]
  );
  const employerPfAmount = useMemo(
    () => calculateContribution(basicSalary, currentEmployerPfOption),
    [basicSalary, currentEmployerPfOption]
  );
  const esiAmount = useMemo(
    () => calculateEsiContribution(basicSalary, currentEsiOption),
    [basicSalary, currentEsiOption]
  );
  const employeeEsiAmount = useMemo(
    () => calculateEmployeeEsiContribution(basicSalary, currentEmployeeEsiOption),
    [basicSalary, currentEmployeeEsiOption]
  );
  const lwfAmount = useMemo(() => {
    // Placeholder, actual calculation would depend on state-specific LWF rules
    return currentLwfState !== 'Not Selected' ? 0.00 : 0.00;
  }, [currentLwfState]);

  const profTaxAmount = useMemo(() => {
    // Placeholder logic for professional tax
    return currentProfTaxState !== 'Not Selected' ? 200.00 : 0.00;
  }, [currentProfTaxState]);

  const lwfDeductionAmount = useMemo(() => {
    // Placeholder, actual calculation would depend on state-specific LWF rules
    return currentLwfDeductionState !== 'Not Selected' ? 25.00 : 0.00;
  }, [currentLwfDeductionState]);

  const getLabelForOption = (option: ContributionOption) => {
    if (option === 'limit') return '₹1800 Limit';
    if (option === 'variable') return '12.0% Variable';
    return 'Not Selected';
  };

  const getLabelForEsiOption = (option: EsiOption) => {
    if (option === 'variable') return '3.25% Variable';
    return 'Not Selected';
  }
  
  const getLabelForEmployeeEsiOption = (option: EsiOption) => {
    if (option === 'variable') return '0.75% Variable';
    return 'Not Selected';
  };

  const handlePfSave = () => {
    setCurrentPfOption(pfOption);
    setPfLabel(getLabelForOption(pfOption) || 'Not Selected');
    setIsPfDialogOpen(false);
  };

  const handleEmployerPfSave = () => {
    setCurrentEmployerPfOption(employerPfOption);
    setEmployerPfLabel(getLabelForOption(employerPfOption));
    setIsEmployerPfDialogOpen(false);
  };

  const handleEsiSave = () => {
    setCurrentEsiOption(esiOption);
    setEsiLabel(getLabelForEsiOption(esiOption));
    setIsEsiDialogOpen(false);
  };
  
  const handleEmployeeEsiSave = () => {
    setCurrentEmployeeEsiOption(employeeEsiOption);
    setEmployeeEsiLabel(getLabelForEmployeeEsiOption(employeeEsiOption));
    setIsEmployeeEsiDialogOpen(false);
  };

  const handleLwfSave = () => {
    setCurrentLwfState(lwfState);
    setIsLwfDialogOpen(false);
  };
  
  const handleProfTaxSave = () => {
    setCurrentProfTaxState(profTaxState);
    setIsProfTaxDialogOpen(false);
  };
  
  const handleLwfDeductionSave = () => {
    setCurrentLwfDeductionState(lwfDeductionState);
    setIsLwfDeductionDialogOpen(false);
  };

  const handleUpdateSalary = () => {
    toast({
      title: 'Salary Updated',
      description: 'The salary details have been successfully updated.',
    });
    router.back();
  };

  const renderContributionButton = (label: string, onClick: () => void) => (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-between text-left font-normal"
      onClick={onClick}
    >
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  );

  return (
    <>
      <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Go back"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-lg font-semibold">
              Edit Salary for {format(month, 'MMM yyyy')}
            </h1>
          </div>
          <Button
            variant="link"
            className="text-base font-semibold text-primary"
          >
            History
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="flex items-center justify-center rounded-lg bg-emerald-100/50 p-2 dark:bg-emerald-900/20">
              <Label
                htmlFor="month-selector"
                className="mr-4 text-sm font-medium text-emerald-800 dark:text-emerald-200"
              >
                Select Month
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="month-selector"
                    variant={'outline'}
                    className={cn(
                      'w-[150px] justify-between bg-card text-left font-normal',
                      !month && 'text-muted-foreground'
                    )}
                  >
                    {month ? format(month, 'MMM yyyy') : <span>Select month</span>}
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={month}
                    onSelect={(date) => date && setMonth(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Salary Type</Label>
              <RadioGroup
                defaultValue="per-month"
                value={salaryType}
                onValueChange={setSalaryType}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="per-month" id="per-month" />
                  <Label htmlFor="per-month" className="font-normal">
                    Per Month
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="per-day" id="per-day" />
                  <Label htmlFor="per-day" className="font-normal">
                    Per Day
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="per-hour" id="per-hour" />
                  <Label htmlFor="per-hour" className="font-normal">
                    Per Hour
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary-structure">Salary Structure</Label>
              <Select defaultValue="custom">
                <SelectTrigger id="salary-structure">
                  <SelectValue placeholder="Select structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Breakdown</h3>

              <div className="space-y-2">
                <Label
                  htmlFor="basic-earnings"
                  className="text-muted-foreground"
                >
                  Earnings
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="basic-earnings"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    className="pl-7 pr-20"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                    /month
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent"
              >
                + Add Allowances
              </Button>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Employer Contribution</h3>
              <ContributionRow
                label="Employer PF"
                amount={`₹ ${employerPfAmount.toFixed(2)}`}
              >
                {renderContributionButton(employerPfLabel, () => {
                  setEmployerPfOption(currentEmployerPfOption);
                  setIsEmployerPfDialogOpen(true);
                })}
              </ContributionRow>
              <div className="space-y-3 pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ctc-pf" defaultChecked />
                  <Label
                    htmlFor="ctc-pf"
                    className="font-normal text-muted-foreground"
                  >
                    Included in CTC Amount
                  </Label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edli-charges" />
                    <Label
                      htmlFor="edli-charges"
                      className="font-normal text-muted-foreground"
                    >
                      PF EDLI & Admin Charges
                    </Label>
                  </div>
                  <p className="font-semibold text-muted-foreground">₹ 0.00</p>
                </div>
              </div>

              <Separator />

              <ContributionRow label="Employer ESI" amount={`₹ ${esiAmount.toFixed(2)}`}>
                {renderContributionButton(esiLabel, () => {
                    setEsiOption(currentEsiOption);
                    setIsEsiDialogOpen(true);
                })}
              </ContributionRow>
              <div className="pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ctc-esi" defaultChecked />
                  <Label
                    htmlFor="ctc-esi"
                    className="font-normal text-muted-foreground"
                  >
                    Included in CTC Amount
                  </Label>
                </div>
              </div>

              <Separator />

              <ContributionRow
                label="Labour Welfare Fund"
                amount={`₹ ${lwfAmount.toFixed(2)}`}
              >
                {renderContributionButton(currentLwfState, () => {
                  setLwfState(currentLwfState);
                  setIsLwfDialogOpen(true);
                })}
              </ContributionRow>
              <div className="pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ctc-lwf" defaultChecked />
                  <Label
                    htmlFor="ctc-lwf"
                    className="font-normal text-muted-foreground"
                  >
                    Included in CTC Amount
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Deductions</h3>

              <ContributionRow
                label="Employee PF"
                amount={`₹ ${pfAmount.toFixed(2)}`}
              >
                {renderContributionButton(pfLabel, () => {
                  setPfOption(currentPfOption);
                  setIsPfDialogOpen(true);
                })}
              </ContributionRow>

              <ContributionRow
                label="Employee ESI"
                amount={`₹ ${employeeEsiAmount.toFixed(2)}`}
              >
                {renderContributionButton(employeeEsiLabel, () => {
                  setEmployeeEsiOption(currentEmployeeEsiOption);
                  setIsEmployeeEsiDialogOpen(true);
                })}
              </ContributionRow>

              <ContributionRow
                label="Professional Tax"
                amount={`₹ ${profTaxAmount.toFixed(2)}`}
              >
                {renderContributionButton(currentProfTaxState, () => {
                  setProfTaxState(currentProfTaxState);
                  setIsProfTaxDialogOpen(true);
                })}
              </ContributionRow>

              <ContributionRow
                label="Labour Welfare Fund"
                amount={`₹ ${lwfDeductionAmount.toFixed(2)}`}
              >
                {renderContributionButton(currentLwfDeductionState, () => {
                  setLwfDeductionState(currentLwfDeductionState);
                  setIsLwfDeductionDialogOpen(true);
                })}
              </ContributionRow>

              <Button
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent"
              >
                + Add Deductions
              </Button>
            </div>
          </div>
        </main>

        <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CTC Amount</p>
              <p className="text-lg font-bold">₹ {basicSalary}/month</p>
            </div>
            <Button
              onClick={handleUpdateSalary}
              className="h-12 w-48 bg-accent text-base text-accent-foreground hover:bg-accent/90"
            >
              Update Salary
            </Button>
          </div>
        </footer>
      </div>

      <Dialog open={isPfDialogOpen} onOpenChange={setIsPfDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage PF</DialogTitle>
          </DialogHeader>
          <RadioGroup
            value={pfOption}
            onValueChange={(val) => setPfOption(val as ContributionOption)}
            className="space-y-3 py-4"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="none" id="pf-none" />
              <Label htmlFor="pf-none" className="text-base font-normal">
                None
              </Label>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="limit" id="pf-limit" />
                <Label htmlFor="pf-limit" className="text-base font-normal">
                  ₹1800 Limit
                </Label>
              </div>
              {(pfOption === 'limit' || pfOption === 'variable') && (
                <div className="space-y-4 pl-8 pt-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="pf-limit-basic"
                      checked={pfLimitBasic}
                      onCheckedChange={(c) => setPfLimitBasic(!!c)}
                      disabled
                    />
                    <Label
                      htmlFor="pf-limit-basic"
                      className="font-normal text-muted-foreground"
                    >
                      BASIC
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="pf-limit-incentive"
                      checked={pfLimitIncentive}
                      onCheckedChange={(c) => setPfLimitIncentive(!!c)}
                    />
                    <Label htmlFor="pf-limit-incentive" className="font-normal">
                      Incentive
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="pf-limit-overtime"
                      checked={pfLimitOvertime}
                      onCheckedChange={(c) => setPfLimitOvertime(!!c)}
                    />
                    <Label htmlFor="pf-limit-overtime" className="font-normal">
                      Overtime
                    </Label>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="variable" id="pf-variable" />
                <Label
                  htmlFor="pf-variable"
                  className="text-base font-normal"
                >
                  12.0% Variable
                </Label>
              </div>
            </div>
          </RadioGroup>
          <DialogFooter>
            <Button
              onClick={handlePfSave}
              className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmployerPfDialogOpen} onOpenChange={setIsEmployerPfDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Employer PF</DialogTitle>
          </DialogHeader>
          <RadioGroup
            value={employerPfOption}
            onValueChange={(val) => setEmployerPfOption(val as ContributionOption)}
            className="space-y-3 py-4"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="none" id="employer-pf-none" />
              <Label htmlFor="employer-pf-none" className="text-base font-normal">
                None
              </Label>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="limit" id="employer-pf-limit" />
                <Label htmlFor="employer-pf-limit" className="text-base font-normal">
                  ₹1800 Limit
                </Label>
              </div>
              {(employerPfOption === 'limit' || employerPfOption === 'variable') && (
                <div className="space-y-4 pl-8 pt-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="employer-pf-limit-basic"
                      checked={employerPfLimitBasic}
                      onCheckedChange={(c) => setEmployerPfLimitBasic(!!c)}
                      disabled
                    />
                    <Label
                      htmlFor="employer-pf-limit-basic"
                      className="font-normal text-muted-foreground"
                    >
                      BASIC
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="employer-pf-limit-incentive"
                      checked={employerPfLimitIncentive}
                      onCheckedChange={(c) => setEmployerPfLimitIncentive(!!c)}
                    />
                    <Label htmlFor="employer-pf-limit-incentive" className="font-normal">
                      Incentive
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="employer-pf-limit-overtime"
                      checked={employerPfLimitOvertime}
                      onCheckedChange={(c) => setEmployerPfLimitOvertime(!!c)}
                    />
                    <Label htmlFor="employer-pf-limit-overtime" className="font-normal">
                      Overtime
                    </Label>
                  </div>
                </div>
              )}
            </div>
            <div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="variable" id="employer-pf-variable" />
              <Label
                htmlFor="employer-pf-variable"
                className="text-base font-normal"
              >
                12.0% Variable
              </Label>
            </div>
              </div>
          </RadioGroup>
          <DialogFooter>
            <Button
              onClick={handleEmployerPfSave}
              className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isEsiDialogOpen} onOpenChange={setIsEsiDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage ESI</DialogTitle>
          </DialogHeader>
          <RadioGroup
            value={esiOption}
            onValueChange={(val) => setEsiOption(val as EsiOption)}
            className="space-y-3 py-4"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="none" id="esi-none" />
              <Label htmlFor="esi-none" className="text-base font-normal">
                None
              </Label>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="variable" id="esi-variable" />
                <Label
                  htmlFor="esi-variable"
                  className="text-base font-normal"
                >
                  3.25% Variable
                </Label>
              </div>
              {esiOption === 'variable' && (
                <div className="space-y-4 pl-8 pt-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="esi-basic"
                      checked={esiBasic}
                      onCheckedChange={(c) => setEsiBasic(!!c)}
                      disabled
                    />
                    <Label
                      htmlFor="esi-basic"
                      className="font-normal text-muted-foreground"
                    >
                      BASIC
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="esi-incentive"
                      checked={esiIncentive}
                      onCheckedChange={(c) => setEsiIncentive(!!c)}
                    />
                    <Label htmlFor="esi-incentive" className="font-normal">
                      Incentive
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="esi-overtime"
                      checked={esiOvertime}
                      onCheckedChange={(c) => setEsiOvertime(!!c)}
                    />
                    <Label htmlFor="esi-overtime" className="font-normal">
                      Overtime
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
          <DialogFooter>
            <Button
              onClick={handleEsiSave}
              className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isLwfDialogOpen} onOpenChange={setIsLwfDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Labour Welfare Fund</DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">Select State</p>
          </DialogHeader>
          <ScrollArea className="h-72 pr-4">
              <RadioGroup
                value={lwfState}
                onValueChange={setLwfState}
                className="space-y-1 py-2"
              >
                {indianStates.map((state) => (
                    <div key={state} className="flex items-center space-x-3 p-2 has-[:checked]:bg-muted/80 rounded-md">
                        <RadioGroupItem value={state} id={`lwf-${state}`} />
                        <Label htmlFor={`lwf-${state}`} className="text-base font-normal w-full cursor-pointer">
                            {state}
                        </Label>
                    </div>
                ))}
              </RadioGroup>
          </ScrollArea>
          <DialogFooter>
            <Button
              onClick={handleLwfSave}
              className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmployeeEsiDialogOpen} onOpenChange={setIsEmployeeEsiDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage ESI</DialogTitle>
          </DialogHeader>
          <RadioGroup
            value={employeeEsiOption}
            onValueChange={(val) => setEmployeeEsiOption(val as EsiOption)}
            className="space-y-3 py-4"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="none" id="employee-esi-none" />
              <Label htmlFor="employee-esi-none" className="text-base font-normal">
                None
              </Label>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="variable" id="employee-esi-variable" />
                <Label
                  htmlFor="employee-esi-variable"
                  className="text-base font-normal"
                >
                  0.75% Variable
                </Label>
              </div>
            </div>
          </RadioGroup>
          <DialogFooter>
            <Button
              onClick={handleEmployeeEsiSave}
              className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProfTaxDialogOpen} onOpenChange={setIsProfTaxDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Professional Tax</DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">Select State</p>
          </DialogHeader>
          <ScrollArea className="h-72 pr-4">
              <RadioGroup
                value={profTaxState}
                onValueChange={setProfTaxState}
                className="space-y-1 py-2"
              >
                {indianStates.map((state) => (
                    <div key={state} className="flex items-center space-x-3 p-2 has-[:checked]:bg-muted/80 rounded-md">
                        <RadioGroupItem value={state} id={`ptax-${state}`} />
                        <Label htmlFor={`ptax-${state}`} className="text-base font-normal w-full cursor-pointer">
                            {state}
                        </Label>
                    </div>
                ))}
              </RadioGroup>
          </ScrollArea>
          <DialogFooter>
            <Button
              onClick={handleProfTaxSave}
              className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLwfDeductionDialogOpen} onOpenChange={setIsLwfDeductionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Labour Welfare Fund</DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">Select State</p>
          </DialogHeader>
          <ScrollArea className="h-72 pr-4">
              <RadioGroup
                value={lwfDeductionState}
                onValueChange={setLwfDeductionState}
                className="space-y-1 py-2"
              >
                {indianStates.map((state) => (
                    <div key={`deduction-lwf-${state}`} className="flex items-center space-x-3 p-2 has-[:checked]:bg-muted/80 rounded-md">
                        <RadioGroupItem value={state} id={`deduction-lwf-${state}`} />
                        <Label htmlFor={`deduction-lwf-${state}`} className="text-base font-normal w-full cursor-pointer">
                            {state}
                        </Label>
                    </div>
                ))}
              </RadioGroup>
          </ScrollArea>
          <DialogFooter>
            <Button
              onClick={handleLwfDeductionSave}
              className="h-12 w-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
