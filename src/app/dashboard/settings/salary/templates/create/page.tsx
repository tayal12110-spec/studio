'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-muted-foreground">{children}</h2>
);

const ContributionRow = ({ label, value, onValueChange, children, options }: { label: string; value: string; onValueChange: (value: string) => void; children?: React.ReactNode; options: string[] }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="mt-1">
                <SelectValue placeholder={value} />
            </SelectTrigger>
            <SelectContent>
                {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
        </Select>
        {children}
    </div>
);

type Allowance = {
  name: string;
  value: string;
  type: 'percent' | 'fixed';
}

export default function CreateTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [templateName, setTemplateName] = useState('');
  const [basic, setBasic] = useState('40.0');

  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [isAllowanceSheetOpen, setIsAllowanceSheetOpen] = useState(false);
  const [stagedAllowances, setStagedAllowances] = useState<Record<string, boolean>>({
    'Dearness Allowance': false,
    'HRA': false,
  });

  // State for Add Custom Allowance
  const [addAllowanceView, setAddAllowanceView] = useState<'list' | 'form'>('list');
  const [allowanceName, setAllowanceName] = useState('');
  const [allowanceAmount, setAllowanceAmount] = useState('');
  const [allowanceValueType, setAllowanceValueType] = useState<'percentage' | 'fixed'>('percentage');
  
  // State for Add Deduction
  const [isDeductionSheetOpen, setIsDeductionSheetOpen] = useState(false);
  const [addDeductionView, setAddDeductionView] = useState<'list' | 'form'>('list');

  // Employer Contributions
  const [employerPf, setEmployerPf] = useState('Not Selected');
  const [pfEdliCharges, setPfEdliCharges] = useState(false);
  const [employerEsi, setEmployerEsi] = useState('Not Selected');
  const [employerLwf, setEmployerLwf] = useState('Not Applicable');
  
  // Deductions
  const [employeePf, setEmployeePf] = useState('Not Selected');
  const [employeeEsi, setEmployeeEsi] = useState('Not Selected');
  const [professionalTax, setProfessionalTax] = useState('Not Applicable');
  const [employeeLwf, setEmployeeLwf] = useState('Not Applicable');

  const [isSaving, setIsSaving] = useState(false);

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
        toast({ variant: 'destructive', title: 'Template Name is required.'});
        return;
    }
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        toast({ title: 'Template Created', description: `"${templateName}" has been created.`});
        setIsSaving(false);
        router.back();
    }, 1000);
  };

  const handleOpenAllowanceSheet = () => {
    setAddAllowanceView('list');
    const current = { ...stagedAllowances };
    const allowanceNames = new Set(allowances.map(a => a.name));
    for (const key in current) {
      current[key] = allowanceNames.has(key);
    }
    setStagedAllowances(current);
    setIsAllowanceSheetOpen(true);
  }

  const handleSaveAllowances = () => {
    const currentAllowances = [...allowances];
    const allowanceNames = new Set(currentAllowances.map(a => a.name));

    Object.entries(stagedAllowances).forEach(([name, checked]) => {
      const isPresent = allowanceNames.has(name);
      if (checked && !isPresent) {
        currentAllowances.push({ name, value: '0.0', type: 'percent' });
      } else if (!checked && isPresent) {
        const index = currentAllowances.findIndex(a => a.name === name);
        if (index > -1) {
          currentAllowances.splice(index, 1);
        }
      }
    });

    setAllowances(currentAllowances);
    setIsAllowanceSheetOpen(false);
  };
  
  const handleAllowanceValueChange = (name: string, value: string) => {
      setAllowances(prev => prev.map(a => a.name === name ? {...a, value} : a));
  };
  
  const handleAddCustomAllowance = () => {
    if (!allowanceName.trim() || !allowanceAmount.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide a name and amount for the allowance.',
      });
      return;
    }
    
    setAllowances(prev => [
      ...prev,
      { name: allowanceName, value: allowanceAmount, type: allowanceValueType }
    ]);
    
    setAllowanceName('');
    setAllowanceAmount('');
    setAllowanceValueType('percentage');
    setAddAllowanceView('list');
    
    toast({
      title: 'Allowance Added',
      description: `"${allowanceName}" has been temporarily added.`,
    });
  };
  
  const handleAllowanceSheetOpenChange = (open: boolean) => {
    setIsAllowanceSheetOpen(open);
    if (!open) {
      setAddAllowanceView('list');
    }
  }
  
  const handleDeductionSheetOpenChange = (open: boolean) => {
    setIsDeductionSheetOpen(open);
    if (!open) {
        setAddDeductionView('list');
    }
  }

  const contributionOptions = ['Not Selected', '12.0% Variable', '₹1800 Limit'];
  const esiOptions = ['Not Selected', '3.25% Variable'];
  const lwfOptions = ['Not Applicable', 'Applicable'];
  const employeeEsiOptions = ['Not Selected', '0.75% Variable'];
  const profTaxOptions = ['Not Applicable', 'Applicable'];

  return (
    <>
    <div className="flex h-full min-h-screen flex-col bg-background">
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
        <h1 className="ml-4 text-lg font-semibold">Create Template</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">
            <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input id="template-name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="mt-1" />
            </div>

            <div className="space-y-4">
                <SectionTitle>Earnings</SectionTitle>
                <div className="space-y-2">
                    <Label htmlFor="basic-salary">Basic</Label>
                     <div className="relative">
                        <Input id="basic-salary" value={basic} onChange={(e) => setBasic(e.target.value)} type="number" className="pr-10" />
                        <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
                     </div>
                </div>
                {allowances.map((allowance) => (
                   <div key={allowance.name} className="space-y-2">
                        <Label htmlFor={`allowance-${allowance.name}`}>{allowance.name}</Label>
                        <div className="relative">
                            <Input id={`allowance-${allowance.name}`} value={allowance.value} onChange={(e) => handleAllowanceValueChange(allowance.name, e.target.value)} type="number" className="pr-10" />
                            <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
                        </div>
                   </div>
                ))}
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent" onClick={handleOpenAllowanceSheet}>
                    + Add Allowances
                </Button>
            </div>
            
            <div className="space-y-4">
                <SectionTitle>Employer Contribution</SectionTitle>
                <ContributionRow label="Employer PF" value={employerPf} onValueChange={setEmployerPf} options={contributionOptions}>
                    <div className="flex items-center space-x-2 mt-3 ml-1">
                        <Checkbox id="pf-edli" checked={pfEdliCharges} onCheckedChange={(checked) => setPfEdliCharges(!!checked)} />
                        <Label htmlFor="pf-edli" className="font-normal text-muted-foreground">PF EDLI & Admin Charges</Label>
                    </div>
                </ContributionRow>
                <ContributionRow label="Employer ESI" value={employerEsi} onValueChange={setEmployerEsi} options={esiOptions} />
                <ContributionRow label="Labour Welfare Fund" value={employerLwf} onValueChange={setEmployerLwf} options={lwfOptions} />
            </div>
            
            <div className="space-y-4">
                <SectionTitle>Deductions</SectionTitle>
                <ContributionRow label="Employee PF" value={employeePf} onValueChange={setEmployeePf} options={contributionOptions} />
                <ContributionRow label="Employee ESI" value={employeeEsi} onValueChange={setEmployeeEsi} options={employeeEsiOptions} />
                <ContributionRow label="Professional Tax" value={professionalTax} onValueChange={setProfessionalTax} options={profTaxOptions} />
                <ContributionRow label="Labour Welfare Fund" value={employeeLwf} onValueChange={setEmployeeLwf} options={lwfOptions} />
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent" onClick={() => setIsDeductionSheetOpen(true)}>
                    + Add Deductions
                </Button>
            </div>
        </div>
      </main>
      
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button onClick={handleCreateTemplate} disabled={isSaving} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
             {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             Create Template
        </Button>
      </footer>
    </div>
    <Sheet open={isAllowanceSheetOpen} onOpenChange={handleAllowanceSheetOpenChange}>
        <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
            <SheetHeader className="p-4 flex flex-row items-center justify-between border-b">
                <SheetTitle>Add Allowances</SheetTitle>
                <Button
                    variant="link"
                    className="text-accent"
                    onClick={() => setAddAllowanceView(prev => prev === 'list' ? 'form' : 'list')}
                >
                    {addAllowanceView === 'list' ? 'Add Custom' : 'Select Items'}
                </Button>
            </SheetHeader>
            
            {addAllowanceView === 'list' ? (
                <div className="p-6 space-y-4">
                    {Object.keys(stagedAllowances).map(name => (
                        <div key={name} className="flex items-center space-x-3">
                            <Checkbox 
                                id={name.toLowerCase().replace(' ', '-')} 
                                checked={stagedAllowances[name]}
                                onCheckedChange={(checked) => setStagedAllowances(prev => ({...prev, [name]: !!checked}))} />
                            <Label htmlFor={name.toLowerCase().replace(' ', '-')} className="font-normal text-base">
                                {name}
                            </Label>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="allowance-name">Name</Label>
                        <Input id="allowance-name" value={allowanceName} onChange={(e) => setAllowanceName(e.target.value)} placeholder="Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="allowance-amount">Amount</Label>
                        <Input id="allowance-amount" value={allowanceAmount} onChange={(e) => setAllowanceAmount(e.target.value)} type="number" placeholder="Amount" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="fixed-type" checked={allowanceValueType === 'fixed'} onCheckedChange={() => setAllowanceValueType('fixed')} />
                            <Label htmlFor="fixed-type" className="font-normal">Fixed</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="percentage-type" checked={allowanceValueType === 'percentage'} onCheckedChange={() => setAllowanceValueType('percentage')} />
                            <Label htmlFor="percentage-type" className="font-normal">Percentage</Label>
                        </div>
                    </div>
                </div>
            )}
            
            <SheetFooter className="p-4 border-t">
                 {addAllowanceView === 'list' ? (
                    <Button onClick={handleSaveAllowances} className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90">
                        Save
                    </Button>
                ) : (
                    <Button onClick={handleAddCustomAllowance} disabled={!allowanceName.trim() || !allowanceAmount.trim()} className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90">
                        Add Allowance
                    </Button>
                )}
            </SheetFooter>
        </SheetContent>
    </Sheet>
    
    <Sheet open={isDeductionSheetOpen} onOpenChange={handleDeductionSheetOpenChange}>
        <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
            <SheetHeader className="p-4 flex flex-row items-center justify-between border-b">
                <SheetTitle>Add Deductions</SheetTitle>
                <Button
                    variant="link"
                    className="text-accent"
                    onClick={() => setAddDeductionView(prev => prev === 'list' ? 'form' : 'list')}
                >
                  Add Custom
                </Button>
            </SheetHeader>
             <div className="py-12 text-center">
                <p className="text-lg font-semibold">Please add custom items</p>
                <p className="text-sm text-muted-foreground">Click on "Add Custom" Button</p>
            </div>
            <SheetFooter className="p-4 border-t">
                <Button onClick={() => setIsDeductionSheetOpen(false)} className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90">
                    Save
                </Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
    </>
  );
}
