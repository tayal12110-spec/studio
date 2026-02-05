'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EmployeeListReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [department, setDepartment] = useState('all');
  const [formatType, setFormatType] = useState<'csv'>('csv');

  const handleDownload = () => {
    const reportName = "Employee List Report";

    toast({
      title: 'Downloading Report...',
      description: 'Your employee list report is being generated.',
    });
    
    const departmentString = department === 'all' ? 'All Department' : department;
    
    const queryParams = new URLSearchParams({
        tab: 'downloads',
        report_name: reportName,
        month: 'N/A', // No month for this report type
        branch: departmentString, // Re-using branch for department
        format: formatType,
    });

    router.push(`/dashboard/reports?${queryParams.toString()}`);
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Employee List Report</h1>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
            <AlertDescription>
                Download list of all employees in your company.
            </AlertDescription>
        </Alert>

        <div>
          <Label htmlFor="select-department">Select Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="select-department" className="mt-1">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Department</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
            <Label>Select Format</Label>
            <RadioGroup value={formatType} onValueChange={(value) => setFormatType(value as 'csv')} className="mt-2">
                <div className="rounded-lg border has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                    <Label htmlFor="format-csv" className="flex cursor-pointer items-center gap-3 p-3">
                        <RadioGroupItem value="csv" id="format-csv" />
                        <FileSpreadsheet className="h-5 w-5 text-green-700" />
                        <span className="font-medium">CSV</span>
                    </Label>
                </div>
            </RadioGroup>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleDownload}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Download Report
        </Button>
      </footer>
    </div>
  );
}
