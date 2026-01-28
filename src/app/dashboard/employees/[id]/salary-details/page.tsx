
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const ContributionRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">{label}</Label>
            <div className="flex items-center gap-2">
                <p className="font-semibold">₹ 0.00</p>
            </div>
        </div>
        {children}
    </div>
);


export default function SalaryDetailsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [month, setMonth] = useState(new Date(2026, 0, 1));
    const [salaryType, setSalaryType] = useState('per-month');
    const [basicSalary, setBasicSalary] = useState('9800.00');

    const handleUpdateSalary = () => {
        toast({
            title: 'Salary Updated',
            description: 'The salary details have been successfully updated.',
        });
        router.back();
    };

    return (
        <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="ml-4 text-lg font-semibold">Edit Salary for {format(month, "MMM yyyy")}</h1>
                </div>
                <Button variant="link" className="text-base font-semibold text-primary">History</Button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mx-auto max-w-2xl space-y-8">
                    <div className="flex items-center justify-center rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 p-2">
                        <Label htmlFor="month-selector" className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mr-4">Select Month</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="month-selector"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[150px] justify-between text-left font-normal bg-card",
                                        !month && "text-muted-foreground"
                                    )}
                                >
                                    {month ? format(month, "MMM yyyy") : <span>Select month</span>}
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
                        <RadioGroup defaultValue="per-month" value={salaryType} onValueChange={setSalaryType} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="per-month" id="per-month" />
                                <Label htmlFor="per-month" className="font-normal">Per Month</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="per-day" id="per-day" />
                                <Label htmlFor="per-day" className="font-normal">Per Day</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="per-hour" id="per-hour" />
                                <Label htmlFor="per-hour" className="font-normal">Per Hour</Label>
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
                            <Label htmlFor="basic-earnings" className="text-muted-foreground">Earnings</Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                                <Input id="basic-earnings" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} className="pl-7 pr-20" />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">/month</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full border-accent text-accent-foreground hover:bg-accent/10 hover:text-accent-foreground">
                            + Add Allowances
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Employer Contribution</h3>
                        <ContributionRow label="Employer PF">
                             <Select defaultValue="not-selected">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Not Selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not-selected">Not Selected</SelectItem>
                                </SelectContent>
                            </Select>
                        </ContributionRow>
                        <div className="pl-4 space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="ctc-pf" defaultChecked />
                                <Label htmlFor="ctc-pf" className="font-normal text-muted-foreground">Included in CTC Amount</Label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="edli-charges" />
                                    <Label htmlFor="edli-charges" className="font-normal text-muted-foreground">PF EDLI & Admin Charges</Label>
                                </div>
                                <p className="font-semibold text-muted-foreground">₹ 0.00</p>
                            </div>
                        </div>

                         <Separator />
                        
                        <ContributionRow label="Employer ESI">
                             <Select defaultValue="not-selected">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Not Selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not-selected">Not Selected</SelectItem>
                                </SelectContent>
                            </Select>
                        </ContributionRow>
                         <div className="pl-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="ctc-esi" defaultChecked />
                                <Label htmlFor="ctc-esi" className="font-normal text-muted-foreground">Included in CTC Amount</Label>
                            </div>
                        </div>

                         <Separator />

                        <ContributionRow label="Labour Welfare Fund">
                             <Select defaultValue="not-selected">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Not Selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not-selected">Not Selected</SelectItem>
                                </SelectContent>
                            </Select>
                        </ContributionRow>
                        <div className="pl-4">
                           <div className="flex items-center space-x-2">
                                <Checkbox id="ctc-lwf" defaultChecked />
                                <Label htmlFor="ctc-lwf" className="font-normal text-muted-foreground">Included in CTC Amount</Label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Deductions</h3>
                        
                        <ContributionRow label="Employee PF">
                             <Select defaultValue="not-selected">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Not Selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not-selected">Not Selected</SelectItem>
                                </SelectContent>
                            </Select>
                        </ContributionRow>
                        
                        <ContributionRow label="Employee ESI">
                             <Select defaultValue="not-selected">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Not Selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not-selected">Not Selected</SelectItem>
                                </SelectContent>
                            </Select>
                        </ContributionRow>
                        
                        <ContributionRow label="Professional Tax">
                             <Select defaultValue="not-selected">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Not Selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not-selected">Not Selected</SelectItem>
                                </SelectContent>
                            </Select>
                        </ContributionRow>

                        <ContributionRow label="Labour Welfare Fund">
                             <Select defaultValue="not-selected">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Not Selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not-selected">Not Selected</SelectItem>
                                </SelectContent>
                            </Select>
                        </ContributionRow>
                        
                        <Button variant="outline" className="w-full border-accent text-accent-foreground hover:bg-accent/10 hover:text-accent-foreground">
                            + Add Deductions
                        </Button>
                    </div>

                </div>
            </main>

            <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
                <div className="mx-auto max-w-2xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">CTC Amount</p>
                        <p className="text-lg font-bold">₹ {basicSalary}/month</p>
                    </div>
                    <Button onClick={handleUpdateSalary} className="w-48 h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
                        Update Salary
                    </Button>
                </div>
            </footer>
        </div>
    );
}

