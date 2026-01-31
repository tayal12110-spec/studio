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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-muted-foreground">{children}</h2>
);

const AllowanceRow = ({ label, value, onValueChange, allowanceType, onTypeChange }: { label: string; value: string; onValueChange: (value: string) => void; allowanceType: 'fixed' | 'percentage'; onTypeChange: (type: 'fixed' | 'percentage') => void; }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="relative">
            <Input value={value} onChange={(e) => onValueChange(e.target.value)} type="number" className="pr-10" />
            <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
        </div>
        <div className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
                <Checkbox id={`${label}-fixed`} checked={allowanceType === 'fixed'} onCheckedChange={() => onTypeChange('fixed')} />
                <Label htmlFor={`${label}-fixed`} className="font-normal text-muted-foreground">Fixed</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id={`${label}-percentage`} checked={allowanceType === 'percentage'} onCheckedChange={() => onTypeChange('percentage')} />
                <Label htmlFor={`${label}-percentage`} className="font-normal text-muted-foreground">Percentage</Label>
            </div>
        </div>
    </div>
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

export default function CreateTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [templateName, setTemplateName] = useState('SalaryBox provided breakdown');
  const [basic, setBasic] = useState('50.0');
  const [hra, setHra] = useState('25.0');
  const [travelAllowance, setTravelAllowance] = useState('10.0');
  const [travelAllowanceType, setTravelAllowanceType] = useState<'fixed' | 'percentage'>('percentage');
  const [specialAllowance, setSpecialAllowance] = useState('15.0');
  const [specialAllowanceType, setSpecialAllowanceType] = useState<'fixed' | 'percentage'>('percentage');
  
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

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
        toast({ variant: 'destructive', title: 'Template Name is required.'});
        return;
    }
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        toast({ title: 'Template Saved', description: `"${templateName}" has been saved.`});
        setIsSaving(false);
        router.back();
    }, 1000);
  };

  const contributionOptions = ['Not Selected', '12.0% Variable', '₹1800 Limit'];
  const esiOptions = ['Not Selected', '3.25% Variable'];
  const lwfOptions = ['Not Applicable', 'Applicable'];
  const employeeEsiOptions = ['Not Selected', '0.75% Variable'];
  const profTaxOptions = ['Not Applicable', 'Applicable'];

  return (
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
        <h1 className="ml-4 text-lg font-semibold">SalaryBox provided breakdown</h1>
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
                <div className="space-y-2">
                    <Label htmlFor="hra">HRA</Label>
                     <div className="relative">
                        <Input id="hra" value={hra} onChange={(e) => setHra(e.target.value)} type="number" className="pr-10" />
                        <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
                     </div>
                </div>

                <AllowanceRow 
                    label="Travel Allowance" 
                    value={travelAllowance} 
                    onValueChange={setTravelAllowance} 
                    allowanceType={travelAllowanceType}
                    onTypeChange={(type) => setTravelAllowanceType(type)}
                />
                <AllowanceRow 
                    label="Special Allowance" 
                    value={specialAllowance} 
                    onValueChange={setSpecialAllowance} 
                    allowanceType={specialAllowanceType}
                    onTypeChange={(type) => setSpecialAllowanceType(type)}
                />
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
            </div>
        </div>
      </main>
      
      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button onClick={handleSaveTemplate} disabled={isSaving} className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
             {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             Save Template
        </Button>
      </footer>
    </div>
  );
}
